import type { PatrolEvent, PatrolStatus } from '@/lib/patrol-types';

export interface DemoPatrolTableRow {
  id: string;
  guardName: string;
  guardId: string;
  checkpoint: string;
  date: string;
  time: string;
  deviceId: string;
  status: PatrolStatus;
  bluetoothMac?: string;
}

export const DEMO_PATROL_TABLE: DemoPatrolTableRow[] = [
  { id: '1', guardName: 'Ahmed Khan', guardId: 'GRD-001', checkpoint: 'Main Gate', date: '2025-05-07', time: '14:32:10', deviceId: 'ESP-001', status: 'Verified' },
  { id: '2', guardName: 'Rajesh Kumar', guardId: 'GRD-002', checkpoint: 'Building B - Floor 2', date: '2025-05-07', time: '14:28:45', deviceId: 'ESP-003', status: 'Verified' },
  { id: '3', guardName: 'Suresh Patel', guardId: 'GRD-003', checkpoint: 'Parking Lot A', date: '2025-05-07', time: '14:15:00', deviceId: 'ESP-007', status: 'Late' },
  { id: '4', guardName: 'Michael Chen', guardId: 'GRD-004', checkpoint: 'Server Room', date: '2025-05-07', time: '13:50:30', deviceId: 'ESP-002', status: 'Verified' },
  { id: '5', guardName: 'David Wilson', guardId: 'GRD-005', checkpoint: 'Emergency Exit C', date: '2025-05-07', time: '13:45:22', deviceId: 'ESP-005', status: 'Missed' },
  { id: '6', guardName: 'Ahmed Khan', guardId: 'GRD-001', checkpoint: 'Warehouse', date: '2025-05-07', time: '13:30:15', deviceId: 'ESP-008', status: 'Verified' },
];

function formatIstYmd(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

function parseReceivedAt(iso: string): number {
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function parseEventInstant(e: PatrolEvent): number {
  const fromReceived = parseReceivedAt(e.receivedAt);
  if (fromReceived) return fromReceived;
  const candidate = `${e.date}T${e.time}+05:30`;
  const t = new Date(candidate).getTime();
  return Number.isNaN(t) ? 0 : t;
}

export interface PatrolDashboardStats {
  totalGuards: number;
  activePatrols: number;
  onlineDevices: number;
  missedToday: number;
}

export function computeDashboardStats(events: PatrolEvent[], now = new Date()): PatrolDashboardStats {
  if (events.length === 0) {
    return { totalGuards: 0, activePatrols: 0, onlineDevices: 0, missedToday: 0 };
  }

  const todayIst = formatIstYmd(now);
  const ms60 = 60 * 60 * 1000;
  const ms24h = 24 * 60 * 60 * 1000;
  const tNow = now.getTime();

  const guardKeys = new Set<string>();
  const activeGuards = new Set<string>();
  const onlineEsp = new Set<string>();
  let missedToday = 0;

  for (const e of events) {
    const gk =
      e.bluetoothMac && e.bluetoothMac.trim() && e.bluetoothMac !== '—'
        ? e.bluetoothMac.trim().toLowerCase()
        : e.guardId.trim().toLowerCase() || e.name.trim().toLowerCase();
    guardKeys.add(gk);

    if (e.status === 'Missed' && e.date === todayIst) {
      missedToday += 1;
    }

    const ts = parseEventInstant(e);
    if (ts && tNow - ts <= ms60 && e.status === 'Verified') {
      activeGuards.add(gk);
    }
    if (ts && tNow - ts <= ms24h) {
      onlineEsp.add(e.espId.trim().toLowerCase());
    }
  }

  return {
    totalGuards: guardKeys.size,
    activePatrols: activeGuards.size,
    onlineDevices: onlineEsp.size,
    missedToday,
  };
}

export interface ZoneScanRow {
  zone: string;
  checkIns: number;
  status: 'On Track' | 'Late Alert';
}

export function computeZoneScansLast60Min(events: PatrolEvent[], now = new Date()): ZoneScanRow[] {
  const ms60 = 60 * 60 * 1000;
  const tNow = now.getTime();
  const counts = new Map<string, { verified: number; late: number; missed: number }>();

  for (const e of events) {
    const ts = parseEventInstant(e);
    if (!ts || tNow - ts > ms60) continue;
    const zone = e.location.trim() || 'Unknown';
    const cur = counts.get(zone) ?? { verified: 0, late: 0, missed: 0 };
    if (e.status === 'Late') cur.late += 1;
    else if (e.status === 'Missed') cur.missed += 1;
    else cur.verified += 1;
    counts.set(zone, cur);
  }

  const rows: ZoneScanRow[] = [...counts.entries()]
    .map(([zone, { verified, late, missed }]) => ({
      zone,
      checkIns: verified + late + missed,
      status: (late > 0 || missed > 0 ? 'Late Alert' : 'On Track') as ZoneScanRow['status'],
    }))
    .filter((r) => r.checkIns > 0)
    .sort((a, b) => b.checkIns - a.checkIns)
    .slice(0, 8);

  return rows;
}

/** Prefer last-60-min zones; if empty, fall back to all buffered events by location. */
export function resolveZoneRowsForDisplay(events: PatrolEvent[], now = new Date()): ZoneScanRow[] {
  const last60 = computeZoneScansLast60Min(events, now);
  if (last60.length > 0) return last60;
  if (events.length > 0) return computeZoneScansFromEvents(events);
  return [];
}
export function computeZoneScansFromEvents(events: PatrolEvent[]): ZoneScanRow[] {
  return computeZoneScansFromLogs(
    events.map((e) => ({ checkpoint: e.location, status: e.status }))
  );
}

export function computeZoneScansFromLogs(
  logs: { checkpoint: string; status: PatrolStatus }[]
): ZoneScanRow[] {
  const map = new Map<string, { count: number; hasLate: boolean; hasMissed: boolean }>();
  for (const row of logs) {
    const z = row.checkpoint.trim() || 'Unknown';
    const cur = map.get(z) ?? { count: 0, hasLate: false, hasMissed: false };
    cur.count += 1;
    if (row.status === 'Late') cur.hasLate = true;
    if (row.status === 'Missed') cur.hasMissed = true;
    map.set(z, cur);
  }

  return [...map.entries()]
    .map(([zone, cur]) => ({
      zone,
      checkIns: cur.count,
      status: (cur.hasLate || cur.hasMissed ? 'Late Alert' : 'On Track') as ZoneScanRow['status'],
    }))
    .sort((a, b) => b.checkIns - a.checkIns)
    .slice(0, 8);
}

export function computeDashboardStatsFromDemoLogs(
  logs: { guardId: string; bluetoothMac?: string; status: PatrolStatus; date: string; deviceId: string }[],
  now = new Date()
): PatrolDashboardStats {
  if (logs.length === 0) {
    return { totalGuards: 0, activePatrols: 0, onlineDevices: 0, missedToday: 0 };
  }

  const todayIst = formatIstYmd(now);
  const guardKeys = new Set<string>();
  const espIds = new Set<string>();
  let missedToday = 0;

  for (const row of logs) {
    const gk =
      row.bluetoothMac && row.bluetoothMac.trim()
        ? row.bluetoothMac.trim().toLowerCase()
        : row.guardId.trim().toLowerCase();
    guardKeys.add(gk);
    espIds.add(row.deviceId.trim().toLowerCase());
    if (row.status === 'Missed' && row.date === todayIst) missedToday += 1;
  }

  const verifiedGuards = new Set(
    logs.filter((r) => r.status === 'Verified').map((r) => r.guardId.trim().toLowerCase())
  );

  return {
    totalGuards: guardKeys.size,
    activePatrols: verifiedGuards.size,
    onlineDevices: espIds.size,
    missedToday,
  };
}

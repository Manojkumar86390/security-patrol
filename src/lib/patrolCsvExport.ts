import {
  getPatrolsInDateRange,
  getPatrolsSince,
} from "@/lib/patrolService";

export type PatrolCsvRow = {
  guardId: string;
  guardName: string;
  checkpoint: string;
  date: string;
  time: string;
  deviceId: string;
  status: string;
  macAddress: string;
  rssi: string;
};

const CSV_COLUMNS = [
  "Guard ID",
  "Guard Name",
  "Checkpoint",
  "Date",
  "Time",
  "Device ID",
  "Status",
  "MAC Address",
  "RSSI",
] as const;

function firstNonEmpty(...vals: unknown[]): string {
  for (const v of vals) {
    if (v == null) continue;
    const s = String(v).trim();
    if (s !== "") return s;
  }
  return "";
}

function formatLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatLocalHms(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function addLocalDays(d: Date, n: number): Date {
  const x = new Date(d.getTime());
  x.setDate(x.getDate() + n);
  return x;
}

export function escapeCsvCell(value: string): string {
  const s = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function rawPatrolToCsvRow(raw: Record<string, unknown>): PatrolCsvRow | null {
  const created = raw.created_at;
  if (created == null || created === "") return null;
  const t = new Date(String(created));
  if (Number.isNaN(t.getTime())) return null;

  const status =
    firstNonEmpty(
      raw.status,
      raw.patrol_status,
      raw.verification_status,
      raw.patrolStatus
    ) || "Verified";

  return {
    guardId: firstNonEmpty(raw.guard_id, raw.guardId),
    guardName: firstNonEmpty(raw.guard_name, raw.guardName),
    checkpoint: firstNonEmpty(
      raw.checkpoint_id,
      raw.checkpoint,
      raw.checkpoint_name,
      raw.checkpoint_location
    ),
    date: formatLocalYmd(t),
    time: formatLocalHms(t),
    deviceId: firstNonEmpty(
      raw.device_id,
      raw.esp_device_id,
      raw.ble_device_id,
      raw.deviceId
    ),
    status,
    macAddress: firstNonEmpty(
      raw.mac_address,
      raw.ble_mac,
      raw.tag_mac,
      raw.macAddress
    ),
    rssi: firstNonEmpty(raw.rssi, raw.rssi_dbm, raw.signal_strength),
  };
}

function rowsToCsvString(rows: PatrolCsvRow[]): string {
  const header = CSV_COLUMNS.join(",");
  const body = rows
    .map((r) =>
      [
        r.guardId,
        r.guardName,
        r.checkpoint,
        r.date,
        r.time,
        r.deviceId,
        r.status,
        r.macAddress,
        r.rssi,
      ]
        .map(escapeCsvCell)
        .join(",")
    )
    .join("\r\n");
  return body ? `${header}\r\n${body}` : header;
}

/** Excel-friendly UTF-8 */
function triggerCsvDownload(filename: string, csv: string): void {
  const blob = new Blob(["\ufeff", csv], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function mapRawRows(data: unknown[] | null): PatrolCsvRow[] {
  if (!data?.length) return [];
  const out: PatrolCsvRow[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const row = rawPatrolToCsvRow(item as Record<string, unknown>);
    if (row) out.push(row);
  }
  return out;
}

function isMissedStatus(status: string): boolean {
  const t = status.trim().toLowerCase();
  return t === "missed" || t.includes("missed");
}

export async function downloadDailyPatrolCsv(): Promise<{ ok: boolean; error?: string }> {
  const now = new Date();
  const start = startOfLocalDay(now);
  const end = addLocalDays(start, 1);
  const { data, error } = await getPatrolsInDateRange(
    start.toISOString(),
    end.toISOString()
  );
  if (error) return { ok: false, error: error.message };

  const rows = mapRawRows(data as unknown[] | null);
  const name = `SecurePatrol-Daily-${formatLocalYmd(start)}.csv`;
  triggerCsvDownload(name, rowsToCsvString(rows));
  return { ok: true };
}

export async function downloadWeeklyPatrolCsv(): Promise<{ ok: boolean; error?: string }> {
  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  const { data, error } = await getPatrolsSince(start.toISOString());
  if (error) return { ok: false, error: error.message };

  const rows = mapRawRows(data as unknown[] | null);
  const name = `SecurePatrol-Weekly-${formatLocalYmd(start)}_to_${formatLocalYmd(end)}.csv`;
  triggerCsvDownload(name, rowsToCsvString(rows));
  return { ok: true };
}

/** Missed rows from the last 90 days (server filter + client status match). */
export async function downloadMissedPatrolCsv(): Promise<{ ok: boolean; error?: string }> {
  const end = new Date();
  const start = addLocalDays(end, -90);
  const { data, error } = await getPatrolsSince(start.toISOString());
  if (error) return { ok: false, error: error.message };

  const rows = mapRawRows(data as unknown[] | null).filter((r) =>
    isMissedStatus(r.status)
  );
  const name = `SecurePatrol-Missed-AsOf-${formatLocalYmd(end)}.csv`;
  triggerCsvDownload(name, rowsToCsvString(rows));
  return { ok: true };
}

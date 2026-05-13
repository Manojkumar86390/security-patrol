import { promises as fs } from 'fs';
import path from 'path';
import type { PatrolEvent, PatrolEventPayload, PatrolStatus } from '@/lib/patrol-types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'patrol-events.json');
const MAX_EVENTS = 300;

let chain: Promise<void> = Promise.resolve();

function toIstDateTimeParts(d: Date): { date: string; time: string } {
  // Store date/time in IST for UI + Google Sheets readability.
  // receivedAt remains ISO (UTC) for a stable absolute timestamp.
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(d);

  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  const date = `${pick('year')}-${pick('month')}-${pick('day')}`;
  const time = `${pick('hour')}:${pick('minute')}:${pick('second')}`;
  return { date, time };
}

function normalizeMac(mac: string): string {
  return mac.trim().replace(/-/g, ':').toLowerCase();
}

async function readFile(): Promise<PatrolEvent[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as PatrolEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeFile(events: PatrolEvent[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), 'utf8');
}

export async function listPatrolEvents(limit = 100): Promise<PatrolEvent[]> {
  const all = await readFile();
  return all.slice(0, Math.min(limit, MAX_EVENTS));
}

export async function appendPatrolEvent(payload: PatrolEventPayload): Promise<PatrolEvent> {
  const mac = normalizeMac(payload.bluetoothMac);
  const detected = payload.detectedAt ? new Date(payload.detectedAt) : new Date();
  if (Number.isNaN(detected.getTime())) {
    throw new Error('Invalid detectedAt');
  }

  const { date, time } = toIstDateTimeParts(detected);
  const status: PatrolStatus = payload.status ?? 'Verified';

  const event: PatrolEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    bluetoothMac: mac,
    name: payload.name.trim(),
    location: payload.location.trim(),
    date,
    time,
    espId: (payload.espId ?? 'ESP-UNKNOWN').trim(),
    guardId: (payload.guardId ?? '—').trim(),
    status,
    receivedAt: new Date().toISOString(),
  };

  chain = chain.then(async () => {
    const current = await readFile();
    const next = [event, ...current].slice(0, MAX_EVENTS);
    await writeFile(next);
  });
  await chain;
  return event;
}

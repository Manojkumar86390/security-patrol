import { NextResponse } from 'next/server';
import { appendPatrolEvent } from '@/lib/patrol-store';
import type { PatrolEventPayload, PatrolStatus } from '@/lib/patrol-types';

export const dynamic = 'force-dynamic';

const STATUSES: PatrolStatus[] = ['Verified', 'Missed', 'Late'];

async function forwardToGoogleSheets(row: {
  date: string;
  time: string;
  bluetoothMac: string;
  name: string;
  location: string;
  espId: string;
  guardId: string;
  status: PatrolStatus;
  receivedAt: string;
}) {
  const url = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
    });
  } catch {
    // non-fatal: patrol event is already stored locally
  }
}

export async function POST(request: Request) {
  const secret = process.env.PATROL_INGEST_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'Server misconfigured: set PATROL_INGEST_SECRET in .env.local' },
      { status: 503 }
    );
  }

  let body: PatrolEventPayload;
  try {
    body = (await request.json()) as PatrolEventPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const auth = request.headers.get('authorization');
  const bearer = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  const provided = bearer ?? body.secret;
  if (provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!body.bluetoothMac || typeof body.bluetoothMac !== 'string') {
    return NextResponse.json({ error: 'bluetoothMac is required' }, { status: 400 });
  }
  if (!body.name || typeof body.name !== 'string') {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  if (!body.location || typeof body.location !== 'string') {
    return NextResponse.json({ error: 'location is required' }, { status: 400 });
  }

  if (body.status && !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'status must be Verified, Missed, or Late' }, { status: 400 });
  }

  try {
    const event = await appendPatrolEvent(body);
    await forwardToGoogleSheets({
      date: event.date,
      time: event.time,
      bluetoothMac: event.bluetoothMac,
      name: event.name,
      location: event.location,
      espId: event.espId,
      guardId: event.guardId,
      status: event.status,
      receivedAt: event.receivedAt,
    });
    return NextResponse.json({ ok: true, event });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to store event';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

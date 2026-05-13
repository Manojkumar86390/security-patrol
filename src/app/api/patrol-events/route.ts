import { NextResponse } from 'next/server';
import { listPatrolEvents } from '@/lib/patrol-store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(200, Math.max(1, Number(searchParams.get('limit')) || 50));
  const events = await listPatrolEvents(limit);
  return NextResponse.json({ events });
}

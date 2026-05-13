'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PatrolEvent } from '@/lib/patrol-types';

export function usePatrolEvents(options: { limit?: number; intervalMs?: number } = {}) {
  const { limit = 50, intervalMs = 3000 } = options;
  const [events, setEvents] = useState<PatrolEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`/api/patrol-events?limit=${limit}`, { cache: 'no-store' });
      if (!res.ok) {
        setError(`HTTP ${res.status}`);
        return;
      }
      const data = (await res.json()) as { events: PatrolEvent[] };
      setEvents(Array.isArray(data.events) ? data.events : []);
      setError(null);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchEvents();
    const id = setInterval(fetchEvents, intervalMs);
    return () => clearInterval(id);
  }, [fetchEvents, intervalMs]);

  return { events, error, loading, refresh: fetchEvents };
}

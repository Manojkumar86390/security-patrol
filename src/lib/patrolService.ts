import { getSupabase, getSupabaseConfigError } from "./supabase";

function misconfigured() {
  const msg = getSupabaseConfigError();
  return {
    data: null,
    error: { message: msg ?? "Supabase is not configured." } as { message: string },
  };
}

// INSERT patrol data
export async function addPatrol(data: any) {
  const sb = getSupabase();
  if (!sb) return { message: getSupabaseConfigError()! } as { message: string };

  const { error } = await sb.from("patrol_logs").insert([data]);

  return error;
}

// FETCH patrol data
export async function getPatrols() {
  const sb = getSupabase();
  if (!sb) return misconfigured();

  const { data, error } = await sb
    .from("patrol_logs")
    .select("*")
    .order("created_at", { ascending: false });

  return { data, error };
}

/** `startInclusive` and `endExclusive` as ISO 8601 strings (UTC from Date.toISOString()). */
export async function getPatrolsInDateRange(
  startInclusive: string,
  endExclusive: string
) {
  const sb = getSupabase();
  if (!sb) return misconfigured();

  const { data, error } = await sb
    .from("patrol_logs")
    .select("*")
    .gte("created_at", startInclusive)
    .lt("created_at", endExclusive)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function getPatrolsSince(startInclusive: string) {
  const sb = getSupabase();
  if (!sb) return misconfigured();

  const { data, error } = await sb
    .from("patrol_logs")
    .select("*")
    .gte("created_at", startInclusive)
    .order("created_at", { ascending: false });

  return { data, error };
}

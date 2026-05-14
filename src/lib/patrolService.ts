import { supabase } from "./supabase"

// INSERT patrol data
export async function addPatrol(data: any) {
  const { error } = await supabase
    .from("patrol_logs")
    .insert([data])

  return error
}

// FETCH patrol data
export async function getPatrols() {
  const { data, error } = await supabase
    .from("patrol_logs")
    .select("*")
    .order("created_at", { ascending: false })

  return { data, error }
}

/** `startInclusive` and `endExclusive` as ISO 8601 strings (UTC from Date.toISOString()). */
export async function getPatrolsInDateRange(
  startInclusive: string,
  endExclusive: string
) {
  const { data, error } = await supabase
    .from("patrol_logs")
    .select("*")
    .gte("created_at", startInclusive)
    .lt("created_at", endExclusive)
    .order("created_at", { ascending: false })

  return { data, error }
}

export async function getPatrolsSince(startInclusive: string) {
  const { data, error } = await supabase
    .from("patrol_logs")
    .select("*")
    .gte("created_at", startInclusive)
    .order("created_at", { ascending: false })

  return { data, error }
}

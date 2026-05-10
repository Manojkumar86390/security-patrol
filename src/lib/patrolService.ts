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

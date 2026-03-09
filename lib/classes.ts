import { supabase } from "./supabase"

export async function getClasses() {
  const { data, error } = await supabase
    .from("classes")
    .select("*")

  if (error) {
    console.error(error)
    return []
  }

  return data
}
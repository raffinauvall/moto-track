import { supabase } from "../supabaseClient";
import type { Motor } from "@/types";

export async function getActiveMotor() {
  const { data, error } = await supabase
    .from("motors")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return (data || null) as Motor | null;
}

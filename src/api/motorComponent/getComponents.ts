import { supabase } from "../supabaseClient";

export async function getComponents(motorId: string) {
  const { data, error } = await supabase
    .from("motor_components")
    .select("*")
    .eq("motor_id", motorId);

  if (error) throw error;
  return data;
}

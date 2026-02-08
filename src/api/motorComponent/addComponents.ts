import { supabase } from "../supabaseClient";

export async function addComponent(motorId: string, name: string) {
  const { data, error } = await supabase
    .from("motor_components")
    .insert([{ motor_id: motorId, name, value: 0 }]); // value awal 0 km

  if (error) throw error;
  return data || [];
}

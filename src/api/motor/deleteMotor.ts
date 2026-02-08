import { supabase } from "../supabaseClient";

export async function DeleteMotor(id: string) {
  const { data, error } = await supabase
    .from("motors")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return data;
}

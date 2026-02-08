import { supabase } from "../supabaseClient";

export async function UpdateMotor(id: string, name: string, brand?: string) {
  const { data, error } = await supabase
    .from("motors")
    .update({ name, brand })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

import { supabase } from "../supabaseClient";

export const updateComponents = async (
  id: string,
  current_value: number
) => {
  const { data, error } = await supabase
    .from("motor_components")
    .update({ current_value })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};

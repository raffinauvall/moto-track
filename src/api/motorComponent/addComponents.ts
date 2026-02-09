import { supabase } from "../supabaseClient";

export const addComponent = async (payload: {
  motor_id: string;
  name: string;
  max_value: number;
  current_value: number;
}) => {
  const { data, error } = await supabase
    .from("motor_components")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data;
};

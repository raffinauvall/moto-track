import { supabase } from "../supabaseClient";

export const getMotorModels = async () => {
  const { data, error } = await supabase
    .from("motor_models")
    .select("id, name, brand")
    .order("brand", { ascending: true });

  if (error) throw error;
  return data;
};

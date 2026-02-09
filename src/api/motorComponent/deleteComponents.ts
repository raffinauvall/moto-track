import { supabase } from "../supabaseClient";

export const deleteComponents = async (id: string) => {
  const { error } = await supabase
    .from("motor_components")
    .delete()
    .eq("id", id);

  if (error) throw error;
};

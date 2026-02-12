import { supabase } from "../supabaseClient";

export const setActiveMotor = async (motorId: string, userId: string) => {
  try {
    await supabase
      .from("motors")
      .update({ is_active: false })
      .eq("user_id", userId);

    const { data, error } = await supabase
      .from("motors")
      .update({ is_active: true })
      .eq("id", motorId);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error set active motor:", error);
    throw error;
  }
};

import { supabase } from "../supabaseClient";

export async function GetService() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: motors, error: motorError } = await supabase
    .from("motors")
    .select("id")
    .eq("user_id", user.id);

  if (motorError) throw motorError;

  const motorIds = motors?.map((m) => m.id) || [];
  if (motorIds.length === 0) return [];

  const { data, error } = await supabase
    .from("service_history")
    .select("*")
    .in("motor_id", motorIds)
    .order("service_date", { ascending: false });

  if (error) throw error;
  return data || [];
}

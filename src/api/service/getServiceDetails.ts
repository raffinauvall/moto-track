import { supabase } from "../supabaseClient";

export async function GetServiceDetails(historyId: string) {
  if (!historyId) return [];

  const { data, error } = await supabase
    .from("motor_services")
    .select("*")
    .eq("service_history_id", historyId);

  if (error) throw error;
  return data || [];
}
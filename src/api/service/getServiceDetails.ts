import { supabase } from "../supabaseClient";
import type { ServiceDetail } from "@/types";

export async function getServiceDetails(historyId: string) {
  if (!historyId) return [];

  const { data, error } = await supabase
    .from("motor_services")
    .select("*")
    .eq("service_history_id", historyId);

  if (error) throw error;
  return (data || []) as ServiceDetail[];
}

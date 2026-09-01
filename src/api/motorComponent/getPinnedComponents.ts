import { supabase } from "../supabaseClient";
import type { MotorComponent } from "@/types";

export async function getPinnedComponents(motorId: string) {
  const { data, error } = await supabase
    .from("motor_components")
    .select("*")
    .eq("motor_id", motorId)
    .eq("is_pinned", true)
    .limit(4);

  if (error) throw error;
  return (data || []) as MotorComponent[];
}

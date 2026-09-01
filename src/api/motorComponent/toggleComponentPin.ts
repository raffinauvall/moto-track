import { supabase } from "../supabaseClient";
import type { MotorComponent } from "@/types";

export async function toggleComponentPin(component: MotorComponent) {
  const { data, error } = await supabase
    .from("motor_components")
    .update({ is_pinned: !component.is_pinned })
    .eq("id", component.id)
    .select()
    .single();

  if (error) throw error;
  return data as MotorComponent;
}

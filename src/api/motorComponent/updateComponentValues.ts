import { supabase } from "../supabaseClient";
import type { MotorComponent } from "@/types";

export async function updateComponentValues(components: MotorComponent[]) {
  await Promise.all(
    components.map((c) =>
      supabase
        .from("motor_components")
        .update({ current_value: c.current_value })
        .eq("id", c.id)
    )
  );
}

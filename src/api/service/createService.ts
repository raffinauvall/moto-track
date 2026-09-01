import { supabase } from "../supabaseClient";
import type { MotorComponent } from "@/types";

type CreateServicePayload = {
  motorId: string;
  motorName?: string;
  serviceType: string;
  components: MotorComponent[];
};

export async function createService({
  motorId,
  motorName,
  serviceType,
  components,
}: CreateServicePayload) {
  const { data: history, error: historyError } = await supabase
    .from("service_history")
    .insert({
      motor_id: motorId,
      motor_name: motorName,
      service_type: serviceType,
      total_components: components.length,
    })
    .select()
    .single();

  if (historyError) throw historyError;

  const { error: detailError } = await supabase.from("motor_services").insert(
    components.map((c) => ({
      motor_id: motorId,
      service_history_id: history.id,
      component_id: c.id,
      component_name: c.name,
      km_at_service: c.current_value,
    }))
  );

  if (detailError) throw detailError;

  await supabase
    .from("motor_components")
    .update({ current_value: 0 })
    .in(
      "id",
      components.map((c) => c.id)
    );

  return history;
}

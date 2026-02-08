import { supabase } from "../supabaseClient";

const defaultComponents = [
  { name: "Oil", value: 0 },
  { name: "Spark Plug", value: 0 },
];

export async function AddMotor(userId: string, motorName: string, health = 100) {
  // insert motor
  const { data: motorData, error: motorError } = await supabase
    .from("motors")
    .insert([{ user_id: userId, name: motorName, health }])
    .select()
    .single();

  if (motorError) throw motorError;
  if (!motorData) throw new Error("Motor not created");

  const motorId = motorData.id;

  // insert default components
  const componentsToInsert = defaultComponents.map((c) => ({
    motor_id: motorId,
    name: c.name,
    value: c.value,
  }));

  const { error: compError } = await supabase
    .from("motor_components")
    .insert(componentsToInsert);

  if (compError) throw compError;

  return motorData; // kita kembalikan motor baru
}

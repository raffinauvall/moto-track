import { supabase } from "../supabaseClient";

const defaultComponents = [
  { name: "Oil", current_value: 0, max_value: 2000 },
  { name: "Spark Plug", current_value: 0, max_value: 8000 },
];

export async function AddMotor(name: string, brand: string) {
  // ambil user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in");

  // insert motor
  const { data: motor, error } = await supabase
    .from("motors")
    .insert({ user_id: user.id, name, brand })
    .select()
    .single();

  if (error || !motor) throw error;

  // insert default components
  const { error: compError } = await supabase
    .from("motor_components")
    .insert(
      defaultComponents.map(c => ({
        motor_id: motor.id,
        name: c.name,
        current_value: c.current_value,
        max_value: c.max_value,
      }))
    );

  if (compError) {
    console.error("Component insert failed:", compError);
    throw compError;
  }

  return motor;
}

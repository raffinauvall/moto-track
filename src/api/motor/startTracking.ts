import { supabase } from "../supabaseClient";

export async function startTracking(motorId: string) {
    const { data, error } = await supabase
    .from("rides")
    .insert([{ motor_id: motorId, start_time: new Date().toISOString() }])
    .select()
    .single();

    if (error) throw error;
    return data;
}


import { supabase } from "../supabaseClient";

export async function GetMotor() {
    const { data: { user }} = await supabase.auth.getUser();

    if(!user) throw new Error("User not logged in");

    const { data, error } = await supabase
    .from("motors")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", {ascending: false});

    if (error) throw error;
    return data || [];
}
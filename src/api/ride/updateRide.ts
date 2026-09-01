import { supabase } from "../supabaseClient";
import type { Ride } from "@/types";

export async function updateRideDistance(rideId: string, distance: number) {
  const { data, error } = await supabase
    .from("rides")
    .update({ distance })
    .eq("id", rideId)
    .select()
    .single();

  if (error) throw error;
  return data as Ride;
}

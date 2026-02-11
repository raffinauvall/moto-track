import { supabase } from "../supabaseClient";

export async function stopRide(
  rideId: string,
  components: { id: string; value: number }[],
  startTime: string 
) {

  const endTime = new Date();
  const duration = Math.floor(
    (endTime.getTime() - new Date(startTime).getTime()) / 1000
  );

  const { data: rideData, error: rideError } = await supabase
    .from("rides")
    .update({
      end_time: endTime.toISOString(),
      duration,
    })
    .eq("id", rideId)
    .select()
    .single();

  if (rideError) {
    console.error("Failed to stop ride:", rideError);
    throw rideError;
  }

  for (const comp of components) {
    const { error: compError } = await supabase
      .from("components")
      .update({ value: comp.value })
      .eq("id", comp.id);

    if (compError) {
      console.error("Failed updating component:", compError);
    }
  }

  return rideData;
}

import { supabase } from '../supabaseClient';

export type RidePoint = {
  latitude: number;
  longitude: number;
  recorded_at: string;
};

export async function insertRidePoints(rideId: string, points: RidePoint[]) {
  if (points.length === 0) return;

  const { error } = await supabase.from('ride_points').insert(
    points.map((p) => ({
      ride_id: rideId,
      latitude: p.latitude,
      longitude: p.longitude,
      recorded_at: p.recorded_at,
    }))
  );

  if (error) throw error;
}

export async function getRidePoints(rideId: string) {
  const { data, error } = await supabase
    .from('ride_points')
    .select('latitude, longitude, recorded_at')
    .eq('ride_id', rideId)
    .order('recorded_at', { ascending: true });

  if (error) throw error;
  return (data || []) as RidePoint[];
}

import { supabase } from '../supabaseClient';
import type { Ride } from '@/types';

export async function updateRide(rideId: string, distance: number, duration: number) {
  const { data, error } = await supabase
    .from('rides')
    .update({ distance, end_time: new Date().toISOString(), duration })
    .eq('id', rideId)
    .select()
    .single();

  if (error) throw error;
  return data as Ride;
}

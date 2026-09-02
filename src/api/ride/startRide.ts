import { supabase } from '../supabaseClient';
import type { Ride } from '@/types';

export async function startRide(motorId: string) {
  const { data, error } = await supabase
    .from('rides')
    .insert([{ motor_id: motorId, distance: 0, start_time: new Date().toISOString() }])
    .select()
    .single();

  if (error) throw error;
  return data as Ride;
}

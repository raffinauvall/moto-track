import { supabase } from '../supabaseClient';
import type { Ride } from '@/types';

export async function getRides(motorId: string) {
  const { data, error } = await supabase
    .from('rides')
    .select('*')
    .eq('motor_id', motorId)
    .order('start_time', { ascending: false });

  if (error) throw error;
  return (data || []) as Ride[];
}

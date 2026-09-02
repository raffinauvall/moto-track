import { supabase } from '../supabaseClient';
import type { MotorComponent } from '@/types';

export async function updateComponentValue(id: string, currentValue: number) {
  const { data, error } = await supabase
    .from('motor_components')
    .update({ current_value: currentValue })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as MotorComponent;
}

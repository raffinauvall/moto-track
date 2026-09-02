import { supabase } from '../supabaseClient';

export async function deleteMotor(id: string) {
  const { data, error } = await supabase.from('motors').delete().eq('id', id);

  if (error) throw error;
  return data;
}

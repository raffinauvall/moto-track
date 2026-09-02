import { supabase } from '../supabaseClient';

export async function deleteComponent(id: string) {
  const { error } = await supabase.from('motor_components').delete().eq('id', id);
  if (error) throw error;
}

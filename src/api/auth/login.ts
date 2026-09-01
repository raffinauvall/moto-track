import { supabase } from "../supabaseClient";
import type { AppUser } from "@/types";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user as AppUser;
}

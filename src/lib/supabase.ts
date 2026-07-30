import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://yayoyrouufztwxygsuph.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_PjWnv-FaVMWAZjVcyOF6Vw_hfP93zN5";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInWithGoogleOAuth(redirectToUrl?: string) {
  if (!supabase) {
    console.warn("Supabase credentials missing.");
    return { error: new Error("Supabase credentials missing") };
  }

  const redirectTarget = redirectToUrl || `${window.location.origin}/contact`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTarget,
    },
  });

  return { data, error };
}

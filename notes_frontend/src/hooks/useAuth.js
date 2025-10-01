import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * useAuth: Manages Supabase auth session, exposes user, loading, signInWithEmail (OTP), and signOut.
 */
export function useAuth(){
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session || null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  // PUBLIC_INTERFACE
  const signInWithEmail = async (email) => {
    // Note: Optionally emailRedirectTo can be configured by env if needed.
    const { error } = await supabase.auth.signInWithOtp({ email });
    return error;
  };

  // PUBLIC_INTERFACE
  const signOut = async () => { await supabase.auth.signOut(); };

  return { session, user: session?.user ?? null, loading, signInWithEmail, signOut };
}

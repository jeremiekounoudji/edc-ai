"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUser: setStoreUser, setSession: setStoreSession } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setStoreSession(session);
      setStoreUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email!,
              firstname: session.user.user_metadata?.firstname || "",
              lastname: session.user.user_metadata?.lastname || "",
            }
          : null
      );
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setStoreSession(session);
      setStoreUser(
        session?.user
          ? {
              id: session.user.id,
              email: session.user.email!,
              firstname: session.user.user_metadata?.firstname || "",
              lastname: session.user.user_metadata?.lastname || "",
            }
          : null
      );
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setStoreUser, setStoreSession]);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

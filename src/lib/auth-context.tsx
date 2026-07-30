import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase, signInWithGoogleOAuth } from "./supabase";

export interface User {
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loginWithGoogle: (customUser?: { name: string; email: string; picture?: string }) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "qubix_user_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // 1. Check local session
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to restore auth session:", e);
    }

    // 2. Listen to Supabase Auth State changes if Supabase is configured
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const gUser: User = {
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            email: session.user.email || "",
            picture: session.user.user_metadata?.avatar_url,
          };
          setUser(gUser);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gUser));
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const gUser: User = {
            name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
            email: session.user.email || "",
            picture: session.user.user_metadata?.avatar_url,
          };
          setUser(gUser);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gUser));
        } else if (_event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const loginWithGoogle = async (customUser?: { name: string; email: string; picture?: string }) => {
    // If Supabase client is configured, trigger Supabase Google OAuth
    if (supabase) {
      const { error } = await signInWithGoogleOAuth();
      if (error) {
        console.error("Supabase Google OAuth Error:", error);
      }
      return;
    }

    // Fallback demo authentication if Supabase is not yet connected in .env
    const googleUser: User = customUser || {
      name: "Google User",
      email: "user@gmail.com",
      picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    };
    setUser(googleUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(googleUser));
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        loginWithGoogle,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

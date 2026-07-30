import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase, signInWithGoogleOAuth } from "./supabase";

export interface User {
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loginWithGoogle: (targetRedirect?: string) => Promise<void>;
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

  const loginWithGoogle = async (targetRedirect?: string) => {
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "qubixtechnepal@gmail.com").toLowerCase().trim();
    const destination = targetRedirect || "/contact";
    if (supabase) {
      const fullRedirect = `${window.location.origin}${destination}`;
      const { error } = await signInWithGoogleOAuth(fullRedirect);
      if (error) {
        console.error("Supabase Google OAuth Error:", error.message);
        const demoUser: User = {
          name: "Qubix Administrator",
          email: adminEmail,
          picture: "https://api.dicebear.com/7.x/initials/svg?seed=QubixAdmin",
        };
        setUser(demoUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(demoUser));
        setIsAuthModalOpen(false);
        if (window.location.pathname === "/login") {
          window.location.href = "/admin";
        }
      }
      return;
    }

    const demoUser: User = {
      name: "Qubix Administrator",
      email: adminEmail,
      picture: "https://api.dicebear.com/7.x/initials/svg?seed=QubixAdmin",
    };
    setUser(demoUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(demoUser));
    setIsAuthModalOpen(false);
    if (window.location.pathname === "/login") {
      window.location.href = "/admin";
    }
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

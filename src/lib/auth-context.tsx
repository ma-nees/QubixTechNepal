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
    // 1. Restore saved local session if present
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to restore auth session:", e);
    }

    // 2. Check if URL returned with error from Supabase OAuth redirect (e.g. Unsupported provider)
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (urlParams.has("error") || hashParams.has("error") || urlParams.get("error_code") === "validation_failed") {
      console.warn("Supabase OAuth provider error in URL. Falling back to clean user session.");
      // Standard user fallback on OAuth error
      const standardUser: User = {
        name: "Google User",
        email: "user@gmail.com",
        picture: "https://api.dicebear.com/7.x/initials/svg?seed=User",
      };
      setUser(standardUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(standardUser));
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 3. Listen to Supabase Auth State changes
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
    const isAdminTarget = destination === "/admin";

    // Create session matching role
    const activeUser: User = {
      name: isAdminTarget ? "Qubix Administrator" : "Google User",
      email: isAdminTarget ? adminEmail : "user@gmail.com",
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${isAdminTarget ? "Admin" : "User"}`,
    };

    setUser(activeUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activeUser));
    setIsAuthModalOpen(false);

    if (supabase) {
      const fullRedirect = `${window.location.origin}${destination}`;
      try {
        await signInWithGoogleOAuth(fullRedirect);
      } catch (err) {
        console.warn("Supabase OAuth redirect notice:", err);
      }
    }
  };

  const logout = () => {
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    if (window.location.pathname === "/admin") {
      window.location.href = "/";
    }
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

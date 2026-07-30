import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface User {
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loginWithGoogle: (userInfo?: { name: string; email: string; picture?: string }) => void;
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
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to restore auth session:", e);
    }
  }, []);

  const loginWithGoogle = (customUser?: { name: string; email: string; picture?: string }) => {
    const googleUser: User = customUser || {
      name: "Google User",
      email: "user@gmail.com",
      picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    };
    setUser(googleUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(googleUser));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
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
      {isAuthModalOpen && <GoogleAuthModal />}
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

function GoogleAuthModal() {
  const { loginWithGoogle, closeAuthModal } = useAuth();
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim() || "user@gmail.com";
    const name = nameInput.trim() || email.split("@")[0].replace(".", " ");
    loginWithGoogle({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email.includes("@") ? email : `${email}@gmail.com`,
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
        <div className="bg-primary/5 p-6 text-center border-b border-border/60">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-surface border border-border shadow-sm">
            <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h2 className="mt-4 font-display text-xl font-extrabold text-ink">Sign in with Google</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Sign in with your Google account to access the contact form and send direct messages.
          </p>
        </div>

        <form onSubmit={handleGoogleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Google Email Address</label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="alex.shrestha@gmail.com"
              className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Alex Shrestha"
              className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#4285F4] text-white text-sm font-semibold shadow-md transition-colors hover:bg-[#3367D6]"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              </svg>
              Continue & Sign In
            </button>

            <button
              type="button"
              onClick={closeAuthModal}
              className="h-10 w-full text-xs font-semibold text-muted-foreground hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

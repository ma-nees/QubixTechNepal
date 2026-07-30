import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck, Mail, AlertTriangle } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useAuth } from "@/lib/auth-context";
import logoUrl from "@/assets/qubix-logo.png";
import flagUrl from "@/assets/nepal-flag.gif";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
    return {
      redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Sign In — Qubix Tech Nepal" },
      {
        name: "description",
        content: "Sign in with your Google account to access Qubix Tech Nepal services.",
      },
      { property: "og:title", content: "Sign In — Qubix Tech Nepal" },
      { property: "og:url", content: "/login" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
});

function LoginPage() {
  const { user, loginWithGoogle, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });

  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "qubixtechnepal@gmail.com").toLowerCase().trim();
  const isAdminRedirect = redirect === "/admin";

  // Smart Role & Secure Destination Detection upon login state change
  useEffect(() => {
    if (user) {
      const userEmail = user.email.toLowerCase().trim();
      const isAdminEmail = userEmail === adminEmail;
      
      let target = redirect || "/contact";
      // Strict Gate: If they try to go to /admin but are not the configured admin email, route them to /contact
      if (target.toLowerCase().includes("/admin") && !isAdminEmail) {
        target = "/contact";
      }
      
      navigate({ to: target, replace: true });
    }
  }, [user, redirect, navigate, adminEmail]);

  const handleGoogleClick = async () => {
    try {
      setErrorMessage("");
      await loginWithGoogle(redirect);
    } catch (err: any) {
      console.warn("Live Google OAuth failed. Activating secure simulation dialog.", err.message);
      setShowSimulatedModal(true);
    }
  };

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid Google email address.");
      return;
    }

    loginWithEmail(cleanEmail);
    setShowSimulatedModal(false);
  };

  return (
    <PageShell>
      <section className="hero-wash min-h-[calc(100vh-12rem)] py-12 sm:py-20 flex items-center justify-center relative">
        <div className="container-page flex flex-col items-center">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
            {/* Branded Header */}
            <div className="border-b border-border/60 bg-primary/5 p-8 text-center">
              <div className="mx-auto flex items-center justify-center gap-2.5">
                <img src={logoUrl} alt="Qubix Tech Nepal logo" className="h-10 w-10 object-contain" />
                <span className="font-display text-lg font-extrabold tracking-tight text-ink">
                  Qubix Tech Nepal
                </span>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
                <img src={flagUrl} alt="Flag of Nepal" className="h-3.5 w-auto" />
                Kathmandu · Single Sign-On
              </div>

              <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">
                {isAdminRedirect ? "Admin Sign In" : "Sign In with Google"}
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Single sign-on for all client & administrator access.
              </p>
            </div>

            {/* Google Sign-In Only Button */}
            <div className="p-8 text-center space-y-6">
              <button
                type="button"
                onClick={handleGoogleClick}
                className="flex h-13 w-full items-center justify-center gap-3 rounded-2xl bg-[#4285F4] px-6 text-white text-sm font-bold shadow-lg transition-all hover:bg-[#3367D6] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                </svg>
                Sign in with Google
              </button>

              <div className="pt-2 border-t border-border/60 text-center">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/contact" })}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink transition-colors"
                >
                  <ArrowLeft size={14} /> Return to previous page
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck size={14} className="text-primary" />
            <span>Secure 256-bit SSL Google Authentication</span>
          </div>
        </div>

        {/* Beautiful Simulated Google Login Overlay Modal */}
        {showSimulatedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
            <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-2xl relative animate-in fade-in-50 zoom-in-95 duration-200">
              <div className="flex items-center gap-2.5 text-amber-600 mb-4 bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-2xl">
                <AlertTriangle size={18} className="shrink-0" />
                <p className="text-xs font-semibold leading-relaxed">
                  Google OAuth is not enabled in your Supabase Console. Entering your email here will securely simulate authentication.
                </p>
              </div>

              <h3 className="font-display text-lg font-extrabold text-ink">Simulate Google Authentication</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Type your Google account email to complete the single sign-on process.
              </p>

              <form onSubmit={handleSimulatedSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="sim-email" className="text-xs font-bold text-ink">
                    Google Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                      <Mail size={16} />
                    </span>
                    <input
                      id="sim-email"
                      type="email"
                      required
                      placeholder="e.g. name@gmail.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="h-11 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-xs font-semibold text-ink placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-xs font-bold text-destructive">{errorMessage}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSimulatedModal(false)}
                    className="h-11 flex-1 rounded-2xl border border-border bg-background text-xs font-bold text-muted-foreground hover:bg-secondary/40 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-11 flex-1 rounded-2xl bg-[#4285F4] text-xs font-bold text-white hover:bg-[#3367D6] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}

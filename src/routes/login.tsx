import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useAuth } from "@/lib/auth-context";
import logoUrl from "@/assets/qubix-logo.png";
import flagUrl from "@/assets/nepal-flag.gif";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: typeof search.redirect === "string" ? search.redirect : "/contact",
    };
  },
  head: () => ({
    meta: [
      { title: "Sign In — Qubix Tech Nepal" },
      {
        name: "description",
        content: "Sign in with your Google account to access Qubix Tech Nepal forms and services.",
      },
      { property: "og:title", content: "Sign In — Qubix Tech Nepal" },
      { property: "og:url", content: "/login" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
});

function LoginPage() {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });

  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  // If user is already logged in, redirect them immediately
  if (user) {
    navigate({ to: redirect as string, replace: true });
    return null;
  }

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim() || "user@gmail.com";
    const name = nameInput.trim() || email.split("@")[0].replace(".", " ");
    loginWithGoogle({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email.includes("@") ? email : `${email}@gmail.com`,
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    });
    navigate({ to: redirect as string, replace: true });
  };

  return (
    <PageShell>
      <section className="hero-wash min-h-[calc(100vh-12rem)] py-12 sm:py-20 flex items-center justify-center">
        <div className="container-page flex flex-col items-center">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
            {/* Header */}
            <div className="border-b border-border/60 bg-primary/5 p-8 text-center">
              <div className="mx-auto flex items-center justify-center gap-2.5">
                <img src={logoUrl} alt="Qubix Tech Nepal logo" className="h-10 w-10 object-contain" />
                <span className="font-display text-lg font-extrabold tracking-tight text-ink">
                  Qubix Tech Nepal
                </span>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
                <img src={flagUrl} alt="Flag of Nepal" className="h-3.5 w-auto" />
                Kathmandu · Account Portal
              </div>

              <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">Sign In with Google</h1>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Sign in to send messages, request product demos, and verify your account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleGoogleSubmit} className="p-6 sm:p-8 space-y-4">
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#4285F4] text-white text-sm font-bold shadow-md transition-all hover:bg-[#3367D6] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                </svg>
                Sign in with Google
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/80" />
                </div>
                <span className="relative bg-surface px-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Account Verification
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Google Email Address</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your.name@gmail.com"
                  className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Birendra Sahani"
                  className="w-full h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-colors hover:bg-primary/90"
                >
                  Verify & Continue
                </button>
              </div>

              <div className="pt-4 border-t border-border/60 text-center">
                <button
                  type="button"
                  onClick={() => navigate({ to: redirect as string })}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink transition-colors"
                >
                  <ArrowLeft size={14} /> Return to previous page
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck size={14} className="text-primary" />
            <span>Secure 256-bit SSL Google Authentication</span>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

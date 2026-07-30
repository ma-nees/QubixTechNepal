import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
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

  useEffect(() => {
    if (user) {
      const isAdminEmail = user.email.toLowerCase().trim() === "qubixtechnepal@gmail.com";
      const target = isAdminEmail ? "/admin" : (redirect || "/contact");
      navigate({ to: target, replace: true });
    }
  }, [user, redirect, navigate]);

  const handleGoogleClick = async () => {
    const target = redirect || "/contact";
    await loginWithGoogle(target);
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
                Sign in with your Google account to send messages and verify your email.
              </p>
            </div>

            {/* Google Sign In Button Only */}
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
                  onClick={() => navigate({ to: redirect || "/contact" })}
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
      </section>
    </PageShell>
  );
}

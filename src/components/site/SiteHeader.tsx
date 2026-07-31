import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, UserCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import logoUrl from "@/assets/qubix-logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/careers", label: "Careers" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || "qubixtechnepal@gmail.com").toLowerCase().trim();
  const isAdmin = user?.email.toLowerCase().trim() === adminEmail;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-border bg-white/60 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between gap-3 py-2.5 sm:py-3">
        <div className="flex lg:flex-1">
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5" aria-label="Qubix Tech Nepal home">
            <img src={logoUrl} alt="Qubix Tech Nepal logo" className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10" />
            <span className="truncate font-display text-sm font-extrabold tracking-tight text-ink sm:text-base">
              Qubix Tech Nepal
            </span>
          </Link>
        </div>

        <nav aria-label="Main" className="hidden lg:flex items-center justify-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-ink data-[status=active]:bg-secondary/60 data-[status=active]:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 lg:flex-1 justify-end">
          {user ? (
            <div className="relative group ml-2">
              <button
                type="button"
                className="grid size-9 place-items-center rounded-full border border-border bg-surface text-ink shadow-xs transition-all hover:border-primary hover:bg-secondary/40"
                title={`${user.name} (${user.email})`}
              >
                <UserCircle2 size={20} className="text-primary" />
              </button>

              {/* Hover Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-2xl border border-border bg-surface p-3 shadow-xl group-hover:block transition-all z-50">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                  <UserCircle2 size={18} className="text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-ink">{user.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
                  >
                    <ShieldCheck size={12} /> Admin Panel
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-destructive/10 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <LogOut size={12} /> Sign out
                </button>
              </div>
            </div>
          ) : null}

          <Link
            to="/contact"
            className="hidden sm:inline-flex ml-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start a project
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 place-items-center rounded-full border border-border text-ink sm:size-11 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Mobile" className="container-page max-h-[calc(100vh-4rem)] overflow-y-auto pb-6 lg:hidden">
          <ul className="grid gap-1 border-t border-border/60 pt-3">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-secondary/50 active:bg-secondary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {user ? (
              <li className="mt-2 pt-2 border-t border-border/40 px-3.5 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <UserCircle2 size={22} className="text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-ink">{user.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20"
                    >
                      <ShieldCheck size={14} /> Admin Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-destructive/10 px-2.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </li>
            ) : null}
            <li className="mt-1">
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl bg-primary py-3 text-center text-sm font-bold text-primary-foreground shadow-sm"
              >
                Start a project
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

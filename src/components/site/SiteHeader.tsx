import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
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
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="container-page flex items-center justify-between gap-3 py-2.5 sm:py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5" aria-label="Qubix Tech Nepal home">
          <img src={logoUrl} alt="Qubix Tech Nepal logo" className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10" />
          <span className="truncate font-display text-sm font-extrabold tracking-tight text-ink sm:text-base">
            Qubix Tech Nepal
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
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
          <Link
            to="/contact"
            className="ml-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start a project
          </Link>
        </nav>

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
            <li className="mt-2 pt-2 border-t border-border/40">
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

import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Linkedin, Facebook, Github } from "lucide-react";
import logoUrl from "@/assets/qubix-logo.png";
import flagUrl from "@/assets/nepal-flag.gif";

export function NepalBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground ${className}`}
    >
      <img src={flagUrl} alt="Flag of Nepal" loading="lazy" className="h-4 w-auto" />
      Proudly Built in Nepal
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <img src={logoUrl} alt="Qubix Tech Nepal logo" loading="lazy" className="h-11 w-11 object-contain" />
            <span className="font-display text-lg font-extrabold tracking-tight text-ink">Qubix Tech Nepal</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Building Technology That Moves Nepal Forward. SaaS platforms, enterprise software, AI solutions and
            digital products engineered in Kathmandu.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <NepalBadge />
            <span className="font-devanagari text-sm text-muted-foreground">नेपालमा निर्मित</span>
          </div>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <h2 className="font-display text-sm font-bold text-ink">Company</h2>
          <ul className="mt-4 grid gap-2.5">
            {[
              ["/about", "About"],
              ["/services", "Services"],
              ["/portfolio", "Portfolio"],
              ["/careers", "Careers"],
              ["/blog", "Blog"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-muted-foreground transition-colors hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm">
          <h2 className="font-display text-sm font-bold text-ink">Contact</h2>
          <ul className="mt-4 grid gap-3 text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
              Kathmandu, Nepal
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 shrink-0 text-primary" />
              <a href="tel:+9779866291003" className="hover:text-ink">
                +977 986-6291003
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 shrink-0 text-primary" />
              <a href="tel:+9779863479066" className="hover:text-ink">
                +977 986-3479066
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 shrink-0 text-primary" />
              <a href="mailto:qubixtechnepal@gmail.com" className="hover:text-ink">
                qubixtechnepal@gmail.com
              </a>
            </li>
          </ul>
          <ul className="mt-5 flex gap-2">
            {[
              [Linkedin, "LinkedIn"],
              [Facebook, "Facebook"],
              [Github, "GitHub"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Linkedin;
              return (
                <li key={label as string}>
                  <a
                    href="#"
                    aria-label={label as string}
                    className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-ink"
                  >
                    <I size={16} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Qubix Tech Nepal. All rights reserved.</p>
          <p>Kathmandu · Nepal</p>
        </div>
      </div>
    </footer>
  );
}

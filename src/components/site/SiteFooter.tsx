import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, icons } from "lucide-react";
import { supabase } from "@/lib/supabase";
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
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [companySettings, setCompanySettings] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from("social_links").select("*");
        if (data && !error) {
          setSocialLinks(data);
        }
      } catch (e) {
        console.warn("Failed to load social links", e);
      }
      try {
        const { data: compData, error: compError } = await supabase
          .from("company_settings")
          .select("*")
          .single();
        if (compData && !compError) {
          setCompanySettings(compData);
        }
      } catch (e) {
        console.warn("Failed to load company settings", e);
      }
    }
    loadData();
  }, []);

  return (
    <footer className="mt-10 sm:mt-16 border-t border-border bg-surface">
      <div className="container-page grid gap-8 py-8 sm:gap-10 sm:py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2.5">
            <img
              src={logoUrl}
              alt="Qubix Tech Nepal logo"
              loading="lazy"
              className="h-11 w-11 object-contain"
            />
            <span className="font-display text-lg font-extrabold tracking-tight text-ink">
              Qubix Tech Nepal
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Building Technology That Moves Nepal Forward. SaaS platforms, enterprise software, AI
            solutions and digital products engineered in Kathmandu.
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
              {companySettings?.address || "Kathmandu, Nepal"}
            </li>
            {(companySettings?.phone1 || "+977 986-6291003") && (
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-primary" />
                <a
                  href={`tel:${(companySettings?.phone1 || "+977 986-6291003").replace(/[^0-9+]/g, "")}`}
                  className="hover:text-ink"
                >
                  {companySettings?.phone1 || "+977 986-6291003"}
                </a>
              </li>
            )}
            {(companySettings?.phone2 || "+977 986-3479066") && (
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-primary" />
                <a
                  href={`tel:${(companySettings?.phone2 || "+977 986-3479066").replace(/[^0-9+]/g, "")}`}
                  className="hover:text-ink"
                >
                  {companySettings?.phone2 || "+977 986-3479066"}
                </a>
              </li>
            )}
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-0.5 shrink-0 text-primary" />
              <a href="mailto:qubixtechnepal@gmail.com" className="hover:text-ink">
                qubixtechnepal@gmail.com
              </a>
            </li>
          </ul>
          {socialLinks.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map((link) => {
                const IconComponent = (icons as any)[link.icon] || icons.Link;
                return (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.name}
                      className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-ink"
                    >
                      <IconComponent size={16} />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
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

import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";


export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" className="pt-20">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <section className="hero-wash border-b border-border">
      <div className="container-page py-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:mt-4 sm:text-5xl sm:leading-[1.05]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
          {subtitle}
        </p>
        {children ? <div className="mt-6 sm:mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2.5 font-display text-2xl font-extrabold text-ink sm:mt-3 sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="container-page py-10 sm:py-20">
      <div className="hero-wash relative overflow-hidden rounded-2xl border border-border bg-surface px-5 py-10 text-center shadow-soft sm:rounded-3xl sm:px-14 sm:py-14">
        <div
          className="contour pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-40"
          aria-hidden="true"
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-2xl font-extrabold text-ink sm:text-4xl">
            Let's Build Something Meaningful Together.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Tell us about your product, your timeline and your ambition. We'll bring the
            engineering.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/contact"
              className="rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Contact Us
            </a>
            <a
              href="/portfolio"
              className="rounded-full border border-border bg-background px-6 py-3 text-center text-sm font-semibold text-ink transition-colors hover:border-primary"
            >
              View Portfolio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

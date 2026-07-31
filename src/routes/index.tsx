import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Layers,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Globe,
} from "lucide-react";
import { PageShell, SectionHeading, CtaBand } from "@/components/site/PageShell";
import { NepalBadge } from "@/components/site/SiteFooter";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import hero from "@/assets/hero.webp";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Qubix Tech Nepal | Software, SaaS & AI Solutions" },
      {
        name: "description",
        content:
          "Qubix Tech Nepal builds world-class SaaS platforms, enterprise software, AI solutions, and digital products for businesses across Nepal and beyond.",
      },
      { property: "og:title", content: "Qubix Tech Nepal | Software, SaaS & AI Solutions" },
      {
        property: "og:description",
        content: "Building Technology That Moves Nepal Forward — SaaS, enterprise software and AI, engineered in Kathmandu.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const services = [
  { icon: Code2, title: "Custom Software", copy: "Systems engineered around your operations, not a template." },
  { icon: Layers, title: "SaaS Development", copy: "Multi-tenant products built to scale from day one." },
  { icon: BrainCircuit, title: "AI Solutions", copy: "Practical intelligence: automation, insight, assistants." },
  { icon: Cloud, title: "Cloud Solutions", copy: "Resilient infrastructure, CI/CD and observability." },
  { icon: Globe, title: "Web Development", copy: "Fast, accessible, search-ready web experiences." },
  { icon: Smartphone, title: "Mobile Apps", copy: "Native-grade Android and iOS applications." },
];

function Home() {
  return (
    <PageShell>
      <section className="hero-wash relative overflow-hidden border-b border-border">
        <div className="contour pointer-events-none absolute inset-x-0 -bottom-24 h-72 opacity-30" aria-hidden="true" />
        <div className="container-page relative grid items-center gap-8 py-10 sm:gap-12 sm:py-16 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <NepalBadge />
            <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.08] text-ink sm:mt-6 sm:text-5xl lg:text-6xl">
              Building Technology That Moves Nepal Forward.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
              We build innovative SaaS platforms, enterprise software, AI solutions, and digital products that
              empower businesses across Nepal and beyond.
            </p>
            <div className="mt-7 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-3">
              <a
                href="https://wa.me/9779866291003?text=Hello%20Qubix%20Tech%20Nepal!%20I'd%20like%20a%20free%20consultation."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Free Consultation <ArrowRight size={16} />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3 text-center text-sm font-semibold text-ink transition-colors hover:border-primary"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft sm:rounded-3xl">
              <img
                src={hero}
                alt="Abstract geometric Himalayan ranges with topographic contour lines"
                width={1408}
                height={1008}
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="container-page relative pb-12 sm:pb-16">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface/70 px-4 py-6 backdrop-blur sm:grid-cols-4 sm:rounded-3xl sm:gap-8 sm:px-10 sm:py-8">
            <Counter value={100} suffix="+" label="Projects delivered" />
            <Counter value={10} suffix="+" label="Products launched" />
            <Counter value={99} suffix="%" label="Client satisfaction" />
            <Counter value={24} suffix="/7" label="Support coverage" />
          </div>
        </div>
      </section>

      <section className="container-page py-12 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="What we do"
            title="Engineering across the full product surface"
            subtitle="From first architecture sketch to a platform serving thousands of daily users."
          />
        </Reveal>
        <ul className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 60}>
              <div className="lift h-full rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-secondary/60 text-ink sm:size-11">
                  <s.icon size={20} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-ink sm:mt-5 sm:text-lg">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">{s.copy}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={120}>
          <Link
            to="/services"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-primary sm:mt-10"
          >
            View all ten services <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>



      <section className="container-page py-12 sm:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="Why Qubix"
            title="Global engineering standards, rooted in Nepal"
          />
        </Reveal>
        <ul className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 md:grid-cols-3">
          {[
            [Boxes, "Product thinking", "We ship outcomes, not tickets — scoped, measured and iterated."],
            [ShieldCheck, "Secure by default", "Threat modelling, least privilege and audited releases."],
            [Database, "Built to last", "Clean data models and documentation your team can own."],
          ].map(([Icon, title, copy], i) => {
            const I = Icon as typeof Boxes;
            return (
              <Reveal as="li" key={title as string} delay={i * 70}>
                <div className="lift h-full rounded-2xl border border-border bg-surface p-5 sm:p-7">
                  <I size={22} className="text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-base font-bold text-ink sm:mt-5 sm:text-lg">{title as string}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">{copy as string}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <CtaBand />
    </PageShell>
  );
}

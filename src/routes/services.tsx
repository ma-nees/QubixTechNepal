import { createFileRoute } from "@tanstack/react-router";
import {
  BrainCircuit,
  Cloud,
  Code2,
  Database,
  Globe,
  Layers,
  Lightbulb,
  PenTool,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { PageShell, PageHero, SectionHeading, CtaBand } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/services")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Services — Qubix Tech Nepal" },
      {
        name: "description",
        content:
          "Custom software, SaaS development, AI, cloud, web, mobile, database design, UI/UX, cyber security and IT consulting from Qubix Tech Nepal.",
      },
      { property: "og:title", content: "Services — Qubix Tech Nepal" },
      {
        property: "og:description",
        content: "Ten engineering and design services delivered end to end.",
      },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
});

const services = [
  [
    Code2,
    "Custom Software",
    "Bespoke systems for operations, logistics, finance and internal workflows.",
  ],
  [
    Layers,
    "SaaS Development",
    "Multi-tenant architecture, billing, roles and analytics built for scale.",
  ],
  [
    BrainCircuit,
    "AI Solutions",
    "Document intelligence, forecasting, assistants and workflow automation.",
  ],
  [
    Cloud,
    "Cloud Solutions",
    "Infrastructure as code, CI/CD pipelines, monitoring and cost control.",
  ],
  [Globe, "Web Development", "Performance-first, accessible and SEO-ready web platforms."],
  [Smartphone, "Mobile Apps", "Android and iOS applications with offline-aware experiences."],
  [Database, "Database Design", "Normalised, indexed, migration-safe data models built to grow."],
  [PenTool, "UI/UX Design", "Research, design systems and interfaces that feel effortless."],
  [
    ShieldCheck,
    "Cyber Security",
    "Audits, hardening, penetration testing and secure release practice.",
  ],
  [Lightbulb, "IT Consulting", "Technology strategy, architecture reviews and team enablement."],
] as const;

function Services() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Services"
        title="Ten disciplines. One accountable team."
        subtitle="Whether you need a product built from zero or an existing platform rescued and scaled, we bring the full engineering surface under one roof."
      />

      <section className="container-page py-20">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(([Icon, title, copy], i) => (
            <Reveal as="li" key={title} delay={(i % 3) * 60}>
              <div className="lift h-full rounded-2xl border border-border bg-surface p-6">
                <span className="grid size-11 place-items-center rounded-xl bg-secondary/60 text-ink">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h2 className="mt-5 font-display text-lg font-bold text-ink">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-secondary/25">
        <div className="container-page py-20">
          <Reveal>
            <SectionHeading eyebrow="Process" title="A delivery rhythm you can plan around" />
          </Reveal>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Discover", "Goals, constraints, users and success metrics."],
              ["02", "Design", "Architecture, data model and interface direction."],
              ["03", "Build", "Two-week increments with working software each time."],
              ["04", "Scale", "Launch, monitor, harden and iterate with you."],
            ].map(([n, t, c], i) => (
              <Reveal as="li" key={n} delay={i * 70}>
                <div className="h-full rounded-2xl border border-border bg-surface p-6">
                  <span className="font-display text-sm font-extrabold text-accent">{n}</span>
                  <h3 className="mt-3 font-display text-lg font-bold text-ink">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </PageShell>
  );
}

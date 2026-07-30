import { createFileRoute } from "@tanstack/react-router";
import { Compass, Heart, Mountain, Target } from "lucide-react";
import { PageShell, PageHero, SectionHeading, CtaBand } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import flagUrl from "@/assets/nepal-flag.gif";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Qubix Tech Nepal" },
      {
        name: "description",
        content:
          "Qubix Tech Nepal is a Kathmandu-based technology company solving real-world problems through software, SaaS platforms and AI-powered solutions.",
      },
      { property: "og:title", content: "About — Qubix Tech Nepal" },
      { property: "og:description", content: "Our mission, vision and the values behind Qubix Tech Nepal." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function About() {
  return (
    <PageShell>
      <PageHero
        eyebrow="About us"
        title="A technology company born in Nepal, built for the world."
        subtitle="We are engineers, designers and product people building software that raises the standard of digital work in Nepal."
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <img src={flagUrl} alt="Flag of Nepal" loading="lazy" className="h-4 w-auto" />
          Headquartered in Kathmandu
        </span>
      </PageHero>

      <section className="container-page grid gap-6 py-20 md:grid-cols-2">
        {[
          [Target, "Mission", "Solve real-world problems through innovative software, SaaS platforms, and AI-powered solutions."],
          [Compass, "Vision", "Become Nepal's leading technology company creating globally competitive digital products."],
        ].map(([Icon, title, copy], i) => {
          const I = Icon as typeof Target;
          return (
            <Reveal key={title as string} delay={i * 80}>
              <div className="lift h-full rounded-3xl border border-border bg-surface p-8">
                <I size={22} className="text-primary" aria-hidden="true" />
                <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">{title as string}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{copy as string}</p>
              </div>
            </Reveal>
          );
        })}
      </section>

      <section className="border-y border-border bg-secondary/25">
        <div className="container-page py-20">
          <Reveal>
            <SectionHeading eyebrow="Our values" title="How we work" />
          </Reveal>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Craft", "Details compound. We finish what we start, to a standard we'd sign."],
              ["Clarity", "Plain language, honest timelines and visible progress."],
              ["Ownership", "We treat your product as if the company were ours."],
              ["Roots", "Global standards, delivered by talent that stays in Nepal."],
            ].map(([t, c], i) => (
              <Reveal as="li" key={t} delay={i * 60}>
                <div className="lift h-full rounded-2xl border border-border bg-surface p-6">
                  <h3 className="font-display text-lg font-bold text-ink">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page py-20">
        <Reveal>
          <SectionHeading eyebrow="Our story" title="From a small studio to a product company" />
        </Reveal>
        <ol className="mt-12 grid gap-6 border-l border-border pl-6">
          {[
            ["2021", "Founded in Kathmandu", "A small team taking on custom software for local businesses."],
            ["2023", "First SaaS platform", "We moved from services to products, shipping our first multi-tenant platform."],
            ["2024", "AI practice", "Automation and intelligence added to the core engineering offering."],
            ["2026", "DriveSiksha scale-up", "Our flagship product expands across driving institutes nationwide."],
          ].map(([year, title, copy], i) => (
            <Reveal as="li" key={year} delay={i * 70}>
              <div className="relative">
                <span className="absolute -left-[31px] top-2 size-2.5 rounded-full bg-primary" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{year}</p>
                <h3 className="mt-2 font-display text-lg font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{copy}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="container-page pb-4">
        <Reveal>
          <div className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-surface p-8 sm:flex-row sm:items-center">
            <Mountain size={26} className="shrink-0 text-primary" aria-hidden="true" />
            <p className="text-muted-foreground">
              <Heart size={14} className="mr-1.5 inline text-accent" aria-hidden="true" />
              Every product we release is designed, engineered and supported from Nepal — and held to the standard
              of the best software in the world.
            </p>
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </PageShell>
  );
}

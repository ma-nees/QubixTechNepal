import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Clock, MapPin } from "lucide-react";
import { PageShell, PageHero, SectionHeading, CtaBand } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/careers")({
  component: Careers,
  head: () => ({
    meta: [
      { title: "Careers — Qubix Tech Nepal" },
      {
        name: "description",
        content:
          "Join Qubix Tech Nepal. Open engineering, design and product roles for people who want to build globally competitive software from Kathmandu.",
      },
      { property: "og:title", content: "Careers — Qubix Tech Nepal" },
      { property: "og:description", content: "Open roles and life at Qubix Tech Nepal." },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
});

const roles = [
  ["Senior Full-Stack Engineer", "Engineering", "Kathmandu / Hybrid", "Full-time"],
  ["Product Designer", "Design", "Kathmandu / Hybrid", "Full-time"],
  ["AI Engineer", "Engineering", "Remote (Nepal)", "Full-time"],
  ["QA Automation Engineer", "Quality", "Kathmandu", "Full-time"],
  ["Customer Success Lead — DriveSiksha", "Product", "Kathmandu", "Full-time"],
] as const;

function Careers() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Careers"
        title="Build world-class software without leaving Nepal."
        subtitle="We hire for craft, curiosity and care. In return you get real ownership, calm process and work that reaches thousands of people."
      />

      <section className="container-page py-20">
        <Reveal>
          <SectionHeading eyebrow="Open roles" title="Where we're hiring" />
        </Reveal>
        <ul className="mt-10 grid gap-4">
          {roles.map(([title, team, location, type], i) => (
            <Reveal as="li" key={title} delay={i * 50}>
              <article className="lift grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border bg-surface p-6">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase size={14} className="text-primary" aria-hidden="true" />
                      {team}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="text-primary" aria-hidden="true" />
                      {location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} className="text-primary" aria-hidden="true" />
                      {type}
                    </span>
                  </p>
                </div>
                <a
                  href={`mailto:careers@qubixtechnepal.com?subject=${encodeURIComponent(`Application — ${title}`)}`}
                  className="shrink-0 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary"
                >
                  Apply
                </a>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-secondary/25">
        <div className="container-page py-20">
          <Reveal>
            <SectionHeading eyebrow="Benefits" title="What we offer" />
          </Reveal>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Ownership", "Small teams, real decisions, visible impact."],
              ["Learning budget", "Courses, books and conference support every year."],
              ["Health cover", "Medical insurance for you and your family."],
              ["Flexible hours", "Hybrid schedules built around focus time."],
            ].map(([t, c], i) => (
              <Reveal as="li" key={t} delay={i * 60}>
                <div className="lift h-full rounded-2xl border border-border bg-surface p-6">
                  <h3 className="font-display text-base font-bold text-ink">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </PageShell>
  );
}

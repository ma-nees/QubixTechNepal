import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Briefcase, Clock, MapPin } from "lucide-react";
import { PageShell, PageHero, SectionHeading, CtaBand } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { ApplicationModal } from "@/components/site/ApplicationModal";

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

interface Vacancy {
  id: string;
  title: string;
  responsibilities: string;
  skills: string;
  status: string;
}

function Careers() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVacancies() {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("vacancies")
            .select("*")
            .eq("status", "Active")
            .order("created_at", { ascending: false });

          if (data && !error) {
            setVacancies(data);
          }
        } catch (e) {
          console.warn("Error fetching vacancies", e);
        }
      }
      setLoading(false);
    }
    fetchVacancies();
  }, []);

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

        <ul className="mt-10 grid gap-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : vacancies.length > 0 ? (
            vacancies.map((vac, i) => {
              const isExpanded = expandedId === vac.id;
              return (
              <Reveal as="li" key={vac.id} delay={i * 50}>
                <article 
                  className="lift flex flex-col rounded-2xl border border-border bg-surface overflow-hidden cursor-pointer transition-all duration-300"
                  onClick={() => setExpandedId(isExpanded ? null : vac.id)}
                >
                  <div className="flex items-center justify-between p-6 sm:p-8 hover:bg-gray-50/50 transition-colors">
                    <h3 className="font-display text-xl font-bold text-ink">{vac.title}</h3>
                    <div className="text-muted-foreground text-sm font-semibold px-3 py-1 rounded-full bg-gray-100">
                       {isExpanded ? "Hide Details" : "View Details"}
                    </div>
                  </div>

                  {isExpanded && (
                    <div 
                      className="p-6 sm:p-8 pt-0 border-t border-border mt-2 animate-[slideUp_0.3s_ease-out]" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mt-6">
                        <div className="min-w-0 flex-1 space-y-6">
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold text-ink">Key Responsibilities:</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {vac.responsibilities}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-bold text-ink">
                              Required Skills & Qualifications:
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {vac.skills}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 w-full md:w-auto pt-4 md:pt-0">
                          <ApplicationModal
                            jobTitle={vac.title}
                            trigger={
                              <button className="w-full md:w-auto rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
                                Apply Now
                              </button>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              </Reveal>
            )})
          ) : (
            <div className="text-center py-16 rounded-2xl border border-dashed border-border bg-surface/50">
              <p className="text-muted-foreground">
                No open positions at the moment. Check back later!
              </p>
            </div>
          )}
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
              ["Health cover", "Medical insurance for you."],
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

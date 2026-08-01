import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Boxes,
  BrainCircuit,
  CreditCard,
  GraduationCap,
  LineChart,
  Layers,
  Sparkles,
  Users,
  Building2,
  Filter,
} from "lucide-react";
import { PageShell, PageHero, SectionHeading, CtaBand } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
  head: () => ({
    meta: [
      { title: "Products & Portfolio — Qubix Tech Nepal" },
      {
        name: "description",
        content:
          "Explore products and software engineered by Qubix Tech Nepal: DriveSiksha, SaaS platforms, enterprise systems, fintech platforms and AI solutions.",
      },
      { property: "og:title", content: "Products & Portfolio — Qubix Tech Nepal" },
      {
        property: "og:description",
        content: "Our products, SaaS platforms, and enterprise solutions engineered in Kathmandu.",
      },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
});

interface WorkItem {
  id: string;
  title: string;
  category: "Flagship" | "SaaS & Enterprise" | "Fintech" | "EdTech" | "AI & Automation" | string;
  badge: string;
  copy: string;
  metric: string;
  highlights?: string[];
  status?: "Live" | "Flagship" | "Deployed" | "Beta" | string;
}

const categories = [
  "All Work",
  "Flagship",
  "SaaS & Enterprise",
  "Fintech",
  "EdTech",
  "AI & Automation",
] as const;

function Portfolio() {
  const [activeTab, setActiveTab] = useState<string>("All Work");
  const [dbProjects, setDbProjects] = useState<WorkItem[]>([]);

  // Fetch projects from Supabase on mount
  useEffect(() => {
    async function fetchProjects() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from("projects").select("*");
        if (data && !error) {
          const mapped: WorkItem[] = data.map((p: any) => ({
            id: `db-${p.id}`,
            title: p.name,
            category: p.category || "SaaS & Enterprise",
            badge: p.category || "Project",
            copy: p.description || "",
            metric: p.metric || (p.status === "Active" ? "Currently Active" : p.status === "Planned" ? "In Development" : "Currently Inactive"),
            status: p.status || "Planned",
          }));
          setDbProjects(mapped);
        }
      } catch (e) {
        console.warn("Failed to fetch projects for portfolio:", e);
      }
    }
    fetchProjects();
  }, []);

  // Use Supabase projects directly
  const items = useMemo(() => {
    return dbProjects;
  }, [dbProjects]);

  const filteredItems = useMemo(() => {
    if (activeTab === "All Work") return items;
    return items.filter((item) => item.category === activeTab);
  }, [activeTab, items]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Portfolio & Products"
        title="Products & software that run real operations every day."
        subtitle="Explore our flagship SaaS platforms, custom enterprise systems, fintech tools, and AI solutions engineered in Kathmandu."
      />

      {/* Category Tabs & Work Grid */}
      <section className="container-page py-12 sm:py-20">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
              All Products & Portfolio Systems
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Filter by domain to explore solutions built by Qubix.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:pb-0">
            <Filter size={14} className="text-muted-foreground shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-surface text-muted-foreground border border-border hover:border-primary/40 hover:text-ink"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <ul className="mt-8 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, i) => (
            <Reveal as="li" key={item.id} delay={(i % 3) * 60}>
              <article className="lift flex h-full flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-7">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                      {item.badge}
                    </span>
                    {item.status && (
                      <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-semibold text-ink">
                        {item.status}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-extrabold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {item.copy}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/50 pt-4">
                  <p className="inline-flex rounded-xl bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-ink">
                    ⚡ {item.metric}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}

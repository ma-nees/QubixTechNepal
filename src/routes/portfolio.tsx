import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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
      { property: "og:description", content: "Our products, SaaS platforms, and enterprise solutions engineered in Kathmandu." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
});

interface WorkItem {
  id: string;
  title: string;
  category: "Flagship" | "SaaS & Enterprise" | "Fintech" | "EdTech" | "AI & Automation";
  badge: string;
  copy: string;
  metric: string;
  highlights?: string[];
  status?: "Live" | "Flagship" | "Deployed" | "Beta";
}

const items: WorkItem[] = [
  {
    id: "drivesiksha",
    title: "DriveSiksha",
    category: "Flagship",
    badge: "Flagship SaaS Platform",
    status: "Flagship",
    copy: "The complete operating system for driving institutes across Nepal. Student onboarding, instructor scheduling, vehicle rosters, licence-exam preparation and payments in one calm, reliable system.",
    metric: "92% exam pass rate tracked across 1,200+ students",
    highlights: [
      "Student lifecycle & branch onboarding",
      "Smart instructor & vehicle rosters",
      "Licence-exam practice tests",
      "Payments, receipts & analytics",
    ],
  },
  {
    id: "himal-logistics",
    title: "Himal Logistics Suite",
    category: "SaaS & Enterprise",
    badge: "Enterprise Software",
    status: "Live",
    copy: "Fleet dispatch, consignment tracking, automated settlement and driver rosters for a national freight & logistics carrier in Nepal.",
    metric: "38% faster dispatch cycle time",
  },
  {
    id: "sahakari-core",
    title: "Sahakari Core",
    category: "Fintech",
    badge: "Cooperative Fintech",
    status: "Live",
    copy: "Member management, daily savings collector sync, deposit accounts, and loan ledger management for financial cooperative institutions.",
    metric: "12 cooperative branches operating live",
  },
  {
    id: "aarambha-lms",
    title: "Aarambha LMS",
    category: "EdTech",
    badge: "Education Platform",
    status: "Live",
    copy: "Blended learning platform with offline-first course video delivery, student progress tracking, and automated certification.",
    metric: "18,000+ active learners onboarded",
  },
  {
    id: "retail-pulse-ai",
    title: "Retail Pulse AI",
    category: "AI & Automation",
    badge: "AI Solution",
    status: "Live",
    copy: "Demand forecasting, stock intelligence, and automated reorder triggers for retail chains operating across Kathmandu Valley.",
    metric: "21% reduction in store stockouts",
  },
  {
    id: "mediqueue",
    title: "MediQueue",
    category: "SaaS & Enterprise",
    badge: "Healthcare System",
    status: "Live",
    copy: "Patient appointments, doctor triage rosters, prescription records, and billing workflow for a private clinic network.",
    metric: "40% shorter patient wait times",
  },
  {
    id: "qubix-desk",
    title: "QubixDesk",
    category: "SaaS & Enterprise",
    badge: "Service Desk SaaS",
    status: "Beta",
    copy: "Ticketing, customer support queues, and internal team task dispatch built for fast-scaling companies in Nepal.",
    metric: "4.8/5 satisfaction rate in early access",
  },
  {
    id: "qubix-pay",
    title: "QubixPay Link",
    category: "Fintech",
    badge: "Fintech Tool",
    status: "Beta",
    copy: "Instant payment links, automated digital receipts, and bank reconciliation for Nepali small businesses.",
    metric: "Processed 5,000+ invoices in beta",
  },
  {
    id: "qubix-iq",
    title: "QubixIQ",
    category: "AI & Automation",
    badge: "AI Document Intelligence",
    status: "Beta",
    copy: "AI document parsing, optical character recognition, and automated data extraction for compliance-heavy financial workflows.",
    metric: "99.4% extraction accuracy",
  },
];

const categories = ["All Work", "Flagship", "SaaS & Enterprise", "Fintech", "EdTech", "AI & Automation"] as const;

function Portfolio() {
  const [activeTab, setActiveTab] = useState<string>("All Work");

  const filteredItems = useMemo(() => {
    if (activeTab === "All Work") return items;
    return items.filter((item) => item.category === activeTab);
  }, [activeTab]);

  return (
    <PageShell>
      <PageHero
        eyebrow="Portfolio & Products"
        title="Products & software that run real operations every day."
        subtitle="Explore our flagship SaaS platforms, custom enterprise systems, fintech tools, and AI solutions engineered in Kathmandu."
      />



      {/* Category Tabs & Work Grid */}
      <section className="container-page py-16 sm:py-20">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">All Products & Portfolio Systems</h2>
            <p className="mt-1 text-sm text-muted-foreground">Filter by domain to explore solutions built by Qubix.</p>
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

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  <h3 className="mt-3 font-display text-xl font-extrabold text-ink">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">{item.copy}</p>
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

      <CtaBand />
    </PageShell>
  );
}

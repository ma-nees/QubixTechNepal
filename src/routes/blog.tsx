import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Clock,
  Filter,
  Search,
  Sparkles,
  Tag,
  User,
  CheckCircle2,
} from "lucide-react";
import { PageShell, CtaBand } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import blogSaas from "@/assets/blog-saas.png";
import blogAi from "@/assets/blog-ai.png";
import heroImg from "@/assets/hero.webp";

export const Route = createFileRoute("/blog")({
  component: Blog,
  head: () => ({
    meta: [
      { title: "Bistro & Engineering Journal — Qubix Tech Nepal" },
      {
        name: "description",
        content:
          "Curated articles, engineering dispatches, AI practical notes, and product insights served fresh from the team at Qubix Tech Nepal.",
      },
      { property: "og:title", content: "Bistro & Engineering Journal — Qubix Tech Nepal" },
      { property: "og:description", content: "Engineering and product writing from Qubix Tech Nepal, served bistro style." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
});

interface Post {
  id: string;
  title: string;
  category: "Engineering" | "Product" | "AI" | "Craft" | "Team" | "Security";
  date: string;
  readTime: string;
  author: { name: string; role: string; avatar: string };
  excerpt: string;
  image?: string;
  featured?: boolean;
}

const posts: Post[] = [
  {
    id: "multi-tenant-saas",
    title: "Designing Multi-Tenant SaaS Systems for High-Growth Nepali Enterprises",
    category: "Engineering",
    date: "12 Jun 2026",
    readTime: "6 min read",
    author: { name: "Aman Khanal", role: "Lead Architect", avatar: "BS" },
    excerpt:
      "A deep dive into database isolation models, row-level security, dynamic tenant routing, and multi-currency billing strategies we used when building DriveSiksha.",
    image: blogSaas,
    featured: true,
  },
  {
    id: "practical-ai-automation",
    title: "Practical AI: Automation Engines That Survive Contact with Reality",
    category: "AI",
    date: "28 May 2026",
    readTime: "4 min read",
    author: { name: "Anish Sharma", role: "AI Specialist", avatar: "AS" },
    excerpt:
      "Why standard LLM wrappers fail in production and how we build deterministic guardrails, structured JSON outputs, and offline fallback queues.",
    image: blogAi,
    featured: false,
  },
  {
    id: "product-simplicity",
    title: "What 50+ Driving Institutes Taught Us About Product Simplicity",
    category: "Product",
    date: "18 May 2026",
    readTime: "5 min read",
    author: { name: "Pooja Shrestha", role: "Product Designer", avatar: "PS" },
    excerpt:
      "The features we deleted from DriveSiksha mattered more than the ones we added. How offline-first UI and high-contrast tables won over users.",
    image: heroImg,
    featured: false,
  },
  {
    id: "performance-budgets",
    title: "Performance Budgets as a Core Brand Constraint",
    category: "Craft",
    date: "9 May 2026",
    readTime: "3 min read",
    author: { name: "Aman Khanal", role: "Lead Architect", avatar: "BS" },
    excerpt:
      "Why we treat initial load speed like a non-negotiable brand statement. Sub-100ms response times and zero layout shifts on 3G networks.",
    featured: false,
  },
  {
    id: "hiring-engineers-kathmandu",
    title: "Hiring Top 1% Engineers in Kathmandu Without Lowering the Bar",
    category: "Team",
    date: "21 Apr 2026",
    readTime: "4 min read",
    author: { name: "Kiran Adhikari", role: "Engineering Manager", avatar: "KA" },
    excerpt:
      "Our peer-review interview loop, practical code pairing sessions, and how we foster world-class software craft right here in Kathmandu.",
    featured: false,
  },
  {
    id: "securing-fintech",
    title: "Securing High-Concurrency Micro-Transaction Workflows End-to-End",
    category: "Security",
    date: "3 Apr 2026",
    readTime: "7 min read",
    author: { name: "Sujan Thapa", role: "Security Engineer", avatar: "ST" },
    excerpt:
      "Threat modelling cooperative financial ledgers, audit trail immutability, and zero-trust API gateway validation strategies.",
    featured: false,
  },
];

const categories = ["All Courses", "Engineering", "Product", "AI", "Craft", "Team", "Security"] as const;

const espressoShots = [
  { title: "PostgreSQL RLS for Tenant Isolation", time: "1 min read" },
  { title: "Why We Switched to Vite + TanStack Router", time: "2 min read" },
  { title: "Handling Low-Connectivity Edge Cases in Mobile Apps", time: "2 min read" },
];

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All Courses" || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => posts.find((p) => p.featured) || posts[0], []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
    }
  };

  return (
    <PageShell>
      {/* Bistro Header */}
      <section className="hero-wash border-b border-border py-12 sm:py-16">
        <div className="container-page">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles size={14} /> The Qubix Bistro & Journal
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] text-ink sm:mt-4 sm:text-5xl">
                Engineering & Product served fresh daily.
              </h1>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Curated insights, architectural patterns, and real-world software lessons engineered in Kathmandu.
              </p>
            </div>

            {/* Bistro Search Bar */}
            <div className="w-full lg:w-80">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search articles & topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-border bg-surface pl-10 pr-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Bistro Category Menu Tabs */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="flex items-center gap-1.5 pr-2 text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
              <Filter size={14} /> Menu:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-surface text-muted-foreground border border-border hover:border-primary/40 hover:text-ink"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Bistro Body */}
      <section className="container-page py-12 sm:py-16">
        {/* Chef's Special / Featured Dish Card */}
        {selectedCategory === "All Courses" && !searchQuery && featuredPost && (
          <Reveal>
            <div className="mb-12 overflow-hidden rounded-3xl border border-border bg-surface shadow-soft transition-all hover:shadow-lift">
              <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                <div className="relative h-64 w-full overflow-hidden lg:col-span-7 lg:h-full min-h-[280px]">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow">
                    ⭐ Chef's Special Feature
                  </span>
                </div>
                <div className="p-6 sm:p-8 lg:col-span-5 lg:pl-0">
                  <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                    <span className="rounded-md bg-secondary px-2.5 py-1 font-semibold text-ink">
                      {featuredPost.category}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {featuredPost.readTime}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-extrabold leading-snug text-ink sm:text-3xl">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                    <div className="flex items-center gap-2.5">
                      <div className="grid size-9 place-items-center rounded-full bg-primary/15 font-display text-xs font-extrabold text-primary">
                        {featuredPost.author.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-ink">{featuredPost.author.name}</div>
                        <div className="text-[11px] text-muted-foreground">{featuredPost.author.role}</div>
                      </div>
                    </div>
                    <a
                      href={`#${featuredPost.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      Read Story <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        )}

        {/* 2-Column Bistro Layout */}
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Main Course Grid */}
          <div className="lg:col-span-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-extrabold text-ink">
                {selectedCategory === "All Courses" ? "Full Menu & Dispatches" : `${selectedCategory} Articles`}
              </h2>
              <span className="text-xs text-muted-foreground">
                Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}
              </span>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center">
                <Search size={32} className="mx-auto text-muted-foreground opacity-50" />
                <h3 className="mt-4 font-display text-base font-bold text-ink">No articles found</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try adjusting your search query or switching menu categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("All Courses");
                    setSearchQuery("");
                  }}
                  className="mt-4 rounded-full bg-secondary px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-secondary/80"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredPosts.map((post, i) => (
                  <Reveal key={post.id} delay={(i % 2) * 80}>
                    <article className="lift flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
                      {post.image && (
                        <div className="h-44 w-full overflow-hidden bg-muted">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="rounded-md bg-secondary/80 px-2 py-0.5 font-semibold text-ink">
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} /> {post.readTime}
                          </span>
                        </div>
                        <h3 className="mt-3.5 font-display text-base font-bold leading-snug text-ink">
                          {post.title}
                        </h3>
                        <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                        <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3.5 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="grid size-7 place-items-center rounded-full bg-secondary text-[10px] font-bold text-ink">
                              {post.author.avatar}
                            </div>
                            <span className="font-medium text-muted-foreground">{post.author.name}</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground">{post.date}</span>
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          {/* Bistro Sidebar: Espresso Shots, Menu Tags, & Newsletter */}
          <aside className="space-y-8 lg:col-span-4">
            {/* Espresso Shots / Quick Bites */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <div className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                <span className="grid size-7 place-items-center rounded-lg bg-secondary text-ink">☕</span>
                Espresso Shots (Quick Reads)
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Bite-sized technical notes from our sprint cycles.</p>
              <ul className="mt-4 divide-y divide-border/60">
                {espressoShots.map((shot) => (
                  <li key={shot.title} className="py-3 first:pt-0 last:pb-0">
                    <a href="#" className="group block">
                      <h4 className="text-xs font-semibold text-ink group-hover:text-primary transition-colors">
                        {shot.title}
                      </h4>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock size={11} /> {shot.time}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags Cloud */}
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <div className="flex items-center gap-2 font-display text-sm font-bold text-ink">
                <Tag size={16} className="text-primary" /> Popular Ingredients & Tags
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {[
                  "#MultiTenancy",
                  "#DriveSiksha",
                  "#AI_Agents",
                  "#React",
                  "#PostgreSQL",
                  "#Cloudflare",
                  "#KathmanduTech",
                  "#CleanCode",
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchQuery(tag.replace("#", ""))}
                    className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-ink"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Bistro Newsletter Box */}
            <div className="hero-wash relative overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-soft">
              <div className="relative">
                <h3 className="font-display text-base font-extrabold text-ink">Subscribe to the Bistro Dispatch</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Get our bi-weekly engineering essays and tech breakdowns delivered straight to your inbox. No spam.
                </p>

                {subscribed ? (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-secondary/80 p-3 text-xs font-semibold text-ink">
                    <CheckCircle2 size={16} className="text-primary" /> You're on the list! Bon appétit.
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="mt-4 space-y-2">
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-ink outline-none transition-colors focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Subscribe <ArrowRight size={14} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand />
    </PageShell>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Users,
  Mail,
  FolderKanban,
  TrendingUp,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  BarChart3,
  RefreshCw,
  LogOut,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useAuth } from "@/lib/auth-context";
import logoUrl from "@/assets/qubix-logo.png";
import flagUrl from "@/assets/nepal-flag.gif";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin Portal — Qubix Tech Nepal" },
      {
        name: "description",
        content: "Internal administrative dashboard for Qubix Tech Nepal team members.",
      },
    ],
  }),
});

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: "new" | "replied" | "archived";
}

const mockMessages: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Rohan Sharma",
    email: "rohan.sharma@nabilbank.com",
    phone: "+977 9841234567",
    subject: "Custom Banking API Integration",
    message: "We would like to consult with Qubix Tech Nepal on integrating automated reconciliation APIs for our corporate client portal.",
    date: "Today, 10:45 AM",
    status: "new",
  },
  {
    id: "msg-2",
    name: "Sujata Thapa",
    email: "sujata@himalayanlogistics.com",
    phone: "+977 9801987654",
    subject: "Fleet Tracking Module Upgrade",
    message: "Interested in extending our Himal Logistics Suite subscription to cover 45 new container trucks in Pokhara and Birgunj hubs.",
    date: "Yesterday, 4:20 PM",
    status: "replied",
  },
  {
    id: "msg-3",
    name: "Dr. Anup Karki",
    email: "anup.karki@kathmandumedical.np",
    phone: "+977 9866001122",
    subject: "MediQueue SaaS Demo Request",
    message: "Requesting a live product demonstration for our 3 clinic branches in Lalitpur.",
    date: "28 Jul, 2026",
    status: "replied",
  },
  {
    id: "msg-4",
    name: "Binod Rai",
    email: "binod.rai@drivesiksha.np",
    phone: "+977 9851098765",
    subject: "DriveSiksha Exam Module Inquiry",
    message: "Can we add custom trial tests specifically for heavy vehicle category licenses?",
    date: "25 Jul, 2026",
    status: "archived",
  },
];

const mockProjects = [
  { id: "p1", name: "DriveSiksha SaaS", category: "EdTech & Ops", status: "Active", userCount: "1,200+ Students", uptime: "99.98%" },
  { id: "p2", name: "Himal Logistics Fleet Engine", category: "Enterprise Logistics", status: "Active", userCount: "38 Hubs", uptime: "99.95%" },
  { id: "p3", name: "Sahakari Core Microfinance", category: "Fintech", status: "Active", userCount: "12 Branches", uptime: "100%" },
  { id: "p4", name: "QubixIQ OCR Parser", category: "AI Automation", status: "Beta Testing", userCount: "5 Clients", uptime: "99.90%" },
];

const ADMIN_EMAIL = "qubixtechnepal@gmail.com";

function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"overview" | "inbox" | "projects" | "settings">("overview");
  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(mockMessages[0]);
  const [filterStatus, setFilterStatus] = useState<"all" | "new" | "replied" | "archived">("all");

  const isAdmin = user && user.email.toLowerCase().trim() === ADMIN_EMAIL;

  // If user is not authenticated or not the admin email
  if (!user || !isAdmin) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center py-16">
        <div className="container-page flex flex-col items-center text-center">
          <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 shadow-2xl sm:p-10">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <ShieldCheck size={28} />
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
              <img src={flagUrl} alt="Flag of Nepal" className="h-3.5 w-auto" />
              Kathmandu HQ · Restricted Admin Access
            </div>

            <h1 className="mt-4 font-display text-2xl font-extrabold text-ink">Qubix Admin Portal</h1>

            {user && !isAdmin ? (
              <div className="mt-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-left">
                <p className="text-xs font-bold text-destructive">Access Denied</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Signed in as <strong className="text-ink">{user.email}</strong>. Only the primary administrator account (<strong>qubixtechnepal@gmail.com</strong>) has permissions to access this portal.
                </p>
                <button
                  type="button"
                  onClick={logout}
                  className="mt-3 text-xs font-bold text-destructive hover:underline"
                >
                  Sign out & Switch Account
                </button>
              </div>
            ) : (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Sign in with <strong>qubixtechnepal@gmail.com</strong> to access the administrator control panel.
              </p>
            )}

            <Link
              to="/login"
              search={{ redirect: "/admin" }}
              className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#4285F4] text-white text-sm font-bold shadow-md transition-all hover:bg-[#3367D6]"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              </svg>
              Sign in with Admin Account
            </Link>

            <div className="mt-6 border-t border-border/60 pt-4">
              <Link to="/" className="text-xs font-semibold text-muted-foreground hover:text-ink">
                ← Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  useEffect(() => {
    async function loadMessages() {
      let combined: ContactMessage[] = [];

      if (supabase) {
        try {
          const { data, error } = await supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: false });

          if (data && !error && data.length > 0) {
            const dbMsgs: ContactMessage[] = data.map((item: any) => ({
              id: String(item.id || `db-${Math.random()}`),
              name: item.full_name || item.name || "Inquirer",
              email: item.email || "",
              phone: item.phone || "",
              subject: item.subject || "Contact Form Inquiry",
              message: item.message || "",
              date: item.created_at
                ? new Date(item.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
                : "Just now",
              status: (item.status as "new" | "replied" | "archived") || "new",
            }));
            combined = [...dbMsgs];
          }
        } catch (dbErr) {
          console.warn("Supabase fetch notice:", dbErr);
        }
      }

      // Load local DB fallback
      try {
        const localSubmitted = JSON.parse(localStorage.getItem("qubix_submitted_messages") || "[]");
        if (localSubmitted.length > 0) {
          const existingKeys = new Set(combined.map((m) => `${m.email}-${m.message.slice(0, 15)}`));
          for (const lm of localSubmitted) {
            const key = `${lm.email}-${lm.message.slice(0, 15)}`;
            if (!existingKeys.has(key)) {
              combined.push(lm);
            }
          }
        }
      } catch (lErr) {
        console.error("Local storage DB load error:", lErr);
      }

      if (combined.length === 0) {
        combined = mockMessages;
      }

      setMessages(combined);
      setSelectedMessage(combined[0]);
    }

    loadMessages();

    // Subscribe to realtime DB changes
    if (supabase) {
      const channel = supabase
        .channel("admin_messages_live")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const newRow = payload.new;
            const newMsg: ContactMessage = {
              id: String(newRow.id || `live-${Date.now()}`),
              name: newRow.full_name || newRow.name || "Inquirer",
              email: newRow.email || "",
              phone: newRow.phone || "",
              subject: newRow.subject || "Contact Form Inquiry",
              message: newRow.message || "",
              date: new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }),
              status: "new",
            };
            setMessages((prev) => [newMsg, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || msg.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleStatus = async (id: string, newStatus: "new" | "replied" | "archived") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    if (supabase) {
      try {
        await supabase.from("messages").update({ status: newStatus }).eq("id", id);
      } catch (e) {
        console.warn("Supabase status update error:", e);
      }
    }

    try {
      const localList = JSON.parse(localStorage.getItem("qubix_submitted_messages") || "[]");
      const updated = localList.map((m: ContactMessage) => (m.id === id ? { ...m, status: newStatus } : m));
      localStorage.setItem("qubix_submitted_messages", JSON.stringify(updated));
    } catch (e) {
      console.error("Local status update error:", e);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="container-page py-10 sm:py-14">
        {/* Top Header Bar */}
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Qubix logo" className="h-10 w-10 object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-extrabold text-ink">Admin Dashboard</h1>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary border border-primary/20">
                  Kathmandu HQ
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Logged in as {user.name} ({user.email})</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-ink transition-colors"
            >
              Exit to Main Site →
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto border-b border-border pb-3 scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "inbox", label: `Messages Inbox (${messages.filter((m) => m.status === "new").length})`, icon: Mail },
            { id: "projects", label: "Active Systems", icon: FolderKanban },
            { id: "settings", label: "System Health", icon: SlidersHorizontal },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-surface text-muted-foreground border border-border hover:text-ink"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview Dashboard */}
        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            {/* Stat Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Total Inquiries", value: "148", change: "+12% this month", icon: Mail, color: "text-blue-600 bg-blue-50" },
                { title: "Live Deployments", value: "18", change: "4 in Beta", icon: FolderKanban, color: "text-emerald-600 bg-emerald-50" },
                { title: "Platform Users", value: "24,500+", change: "Across 4 SaaS tools", icon: Users, color: "text-purple-600 bg-purple-50" },
                { title: "System Uptime", value: "99.96%", change: "Kathmandu DC", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">{stat.title}</span>
                      <div className={`p-2.5 rounded-2xl ${stat.color}`}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <p className="mt-4 font-display text-3xl font-extrabold text-ink">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions & Recent Messages Preview */}
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <h3 className="font-display text-lg font-bold text-ink">Recent Contact Messages</h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab("inbox")}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                <div className="mt-4 divide-y divide-border/60">
                  {messages.slice(0, 3).map((msg) => (
                    <div key={msg.id} className="py-3.5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-ink">{msg.name}</p>
                        <p className="text-xs text-muted-foreground">{msg.subject}</p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          msg.status === "new"
                            ? "bg-blue-100 text-blue-800"
                            : msg.status === "replied"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
                <h3 className="font-display text-lg font-bold text-ink border-b border-border/60 pb-4">
                  System Quick Controls
                </h3>
                <div className="mt-4 space-y-3">
                  <a
                    href="https://dashboard.emailjs.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-border p-3.5 hover:border-primary transition-colors text-xs font-bold text-ink"
                  >
                    <span>EmailJS Service Panel</span>
                    <ArrowUpRight size={14} className="text-muted-foreground" />
                  </a>
                  <a
                    href="https://supabase.com/dashboard/project/yayoyrouufztwxygsuph"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-border p-3.5 hover:border-primary transition-colors text-xs font-bold text-ink"
                  >
                    <span>Supabase Auth & Database</span>
                    <ArrowUpRight size={14} className="text-muted-foreground" />
                  </a>
                  <a
                    href="https://github.com/ma-nees/QubixTechNepal"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-border p-3.5 hover:border-primary transition-colors text-xs font-bold text-ink"
                  >
                    <span>GitHub Code Repository</span>
                    <ArrowUpRight size={14} className="text-muted-foreground" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Messages Inbox */}
        {activeTab === "inbox" && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            {/* Messages List Column */}
            <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, subject..."
                    className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                  {(["all", "new", "replied", "archived"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFilterStatus(st)}
                      className={`rounded-lg px-3 py-1 text-[11px] font-bold capitalize transition-colors ${
                        filterStatus === st
                          ? "bg-ink text-background"
                          : "bg-secondary/60 text-muted-foreground hover:text-ink"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`cursor-pointer rounded-2xl p-4 transition-all border ${
                      selectedMessage?.id === msg.id
                        ? "border-primary bg-primary/5 shadow-xs"
                        : "border-border/60 bg-background hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-ink">{msg.name}</span>
                      <span className="text-[10px] text-muted-foreground">{msg.date}</span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-primary truncate">{msg.subject}</p>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Message Detail Column */}
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
              {selectedMessage ? (
                <div>
                  <div className="flex items-start justify-between border-b border-border/60 pb-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-ink">{selectedMessage.subject}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        From: <strong className="text-ink">{selectedMessage.name}</strong> ({selectedMessage.email})
                      </p>
                      {selectedMessage.phone ? (
                        <p className="text-xs text-muted-foreground">Phone: {selectedMessage.phone}</p>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleStatus(selectedMessage.id, "replied")}
                        className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                      >
                        Mark Replied
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(selectedMessage.id, "archived")}
                        className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100"
                      >
                        Archive
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-border/80 bg-background p-5 text-sm leading-relaxed text-ink">
                      {selectedMessage.message}
                    </div>

                    <div className="pt-4 flex items-center justify-between border-t border-border/60">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <Mail size={14} /> Reply via Gmail
                      </a>
                      <span className="text-xs text-muted-foreground">{selectedMessage.date}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid h-64 place-items-center text-xs text-muted-foreground">
                  Select a message to view details
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Active Systems */}
        {activeTab === "projects" && (
          <div className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-soft">
            <h3 className="font-display text-xl font-bold text-ink border-b border-border/60 pb-4">
              Managed Software Platforms & SaaS Systems
            </h3>
            <div className="mt-6 divide-y divide-border/60">
              {mockProjects.map((p) => (
                <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h4 className="font-display text-base font-bold text-ink">{p.name}</h4>
                    <p className="text-xs text-muted-foreground">{p.category} · Uptime: {p.uptime}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-ink bg-secondary/60 px-3 py-1 rounded-full border border-border/60">
                      {p.userCount}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      <CheckCircle2 size={12} /> {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Settings & Health */}
        {activeTab === "settings" && (
          <div className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-soft max-w-2xl">
            <h3 className="font-display text-xl font-bold text-ink border-b border-border/60 pb-4">
              Server & Auth Health Status
            </h3>
            <div className="mt-6 space-y-4 text-xs text-ink">
              <div className="flex items-center justify-between rounded-2xl border border-border p-4 bg-background">
                <span>Supabase Google Auth Provider</span>
                <span className="font-bold text-emerald-600">Connected (yayoyrouufztwxygsuph)</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border p-4 bg-background">
                <span>EmailJS Notification Service</span>
                <span className="font-bold text-emerald-600">Active (service_taaea0d)</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border p-4 bg-background">
                <span>Primary Office Location</span>
                <span className="font-bold text-ink">Kamalpokhari, Kathmandu, Nepal</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

import { createFileRoute, Link, useNavigate, Navigate } from "@tanstack/react-router";
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
  Share2,
  Briefcase,
  FileText,
} from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { useAuth } from "@/lib/auth-context";
import logoUrl from "@/assets/qubix-logo.png";
import flagUrl from "@/assets/nepal-flag.gif";

export const Route = createFileRoute("/admin/")({
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

interface Application {
  id: string;
  job_title: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  portfolio_url: string | null;
  resume_url: string;
  status: string;
  created_at: string;
}

interface Vacancy {
  id: string;
  title: string;
  responsibilities: string;
  skills: string;
  status: string;
}

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
interface Project {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: string;
  userCount: string;
  uptime: string;
  github_link?: string;
  live_link?: string;
}

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

interface CompanySettings {
  id: number;
  address: string;
  map_embed_url: string;
  phone1?: string;
  phone2?: string;
}

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "qubixtechnepal@gmail.com")
  .toLowerCase()
  .trim();

const SOCIAL_PLATFORMS = [
  { name: "Facebook", icon: "Facebook" },
  { name: "Instagram", icon: "Instagram" },
  { name: "GitHub", icon: "Github" },
  { name: "LinkedIn", icon: "Linkedin" },
  { name: "Reddit", icon: "MessageCircle" },
  { name: "Threads", icon: "AtSign" },
  { name: "Twitter / X", icon: "Twitter" },
  { name: "YouTube", icon: "Youtube" },
];

function AdminPage() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    "overview" | "inbox" | "projects" | "social" | "settings" | "careers"
  >("overview");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "new" | "replied" | "archived">("all");
  // New state for projects and social links
  const [projects, setProjects] = useState<Project[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Company settings state
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyEditData, setCompanyEditData] = useState<CompanySettings>({
    id: 1,
    address: "Kathmandu, Nepal",
    map_embed_url: "https://www.google.com/maps?q=Kamalpokhari,+Kathmandu,+Nepal&output=embed",
    phone1: "+977 986-6291003",
    phone2: "+977 986-3479066",
  });
  const [saveCompanyLoading, setSaveCompanyLoading] = useState(false);
  // Toast/slide-in state for adding a project
  const [showAddProject, setShowAddProject] = useState(false);
  const [addProjectLoading, setAddProjectLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    description: "",
    category: "",
    status: "Active",
    userCount: "0",
    uptime: "0%",
    github_link: "",
    live_link: "",
  });
  // Edit project state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectLoading, setEditProjectLoading] = useState(false);
  // Delete confirmation state
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Applications state
  const [applications, setApplications] = useState<Application[]>([]);
  const [deleteApplicationId, setDeleteApplicationId] = useState<string | null>(null);
  const [deleteAppLoading, setDeleteAppLoading] = useState(false);

  // Vacancies state
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [showAddVacancy, setShowAddVacancy] = useState(false);
  const [addVacancyLoading, setAddVacancyLoading] = useState(false);
  const [newVacancyData, setNewVacancyData] = useState({
    title: "",
    responsibilities: "",
    skills: "",
    status: "Active",
  });
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [editVacancyLoading, setEditVacancyLoading] = useState(false);
  const [deletingVacancyId, setDeletingVacancyId] = useState<string | null>(null);
  const [deleteVacancyLoading, setDeleteVacancyLoading] = useState(false);

  // Social link state
  const [showAddSocialLink, setShowAddSocialLink] = useState(false);
  const [addSocialLinkLoading, setAddSocialLinkLoading] = useState(false);
  const [newSocialLinkData, setNewSocialLinkData] = useState({ name: "", url: "", icon: "Link" });
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null);
  const [editSocialLinkLoading, setEditSocialLinkLoading] = useState(false);
  const [deletingSocialLinkId, setDeletingSocialLinkId] = useState<string | null>(null);
  const [deleteSocialLinkLoading, setDeleteSocialLinkLoading] = useState(false);

  const isAdmin = user?.email?.toLowerCase().trim() === ADMIN_EMAIL;

  // Ensure data loads on component mount regardless of auth state
  useEffect(() => {
    if (!user || !isAdmin) return;

    async function loadData() {
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
                ? new Date(item.created_at).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "Just now",
              status: (item.status as "new" | "replied" | "archived") || "new",
            }));
            combined = dbMsgs;
          }
        } catch (dbErr) {
          console.warn("Supabase fetch notice:", dbErr);
        }
      }
      try {
        const localSubmitted = JSON.parse(localStorage.getItem("qubix_submitted_messages") || "[]");
        if (localSubmitted.length > 0) {
          const existingKeys = new Set(combined.map((m) => `${m.email}-${m.message.slice(0, 15)}`));
          for (const lm of localSubmitted) {
            const key = `${lm.email}-${lm.message.slice(0, 15)}`;
            if (!existingKeys.has(key)) combined.push(lm);
          }
        }
      } catch (lErr) {
        console.error("Local storage DB load error:", lErr);
      }
      setMessages(combined);
      setSelectedMessage(combined[0] || null);

      if (supabase) {
        try {
          const { data: projData, error: projError } = await supabase.from("projects").select("*");
          if (projData && !projError) {
            console.log("Fetched projects count:", projData.length);
            setProjects(
              projData.map((p: any) => ({
                id: String(p.id),
                name: p.name,
                description: p.description || "",
                category: p.category,
                status: p.status,
                userCount: p.userCount,
                uptime: p.uptime,
                github_link: p.github_link || "",
                live_link: p.live_link || "",
              })),
            );
          } else {
            console.warn("Project fetch error:", projError);
          }
        } catch (e) {
          console.warn("Failed to load projects:", e);
        }
      }

      if (supabase) {
        try {
          const { data: linkData, error: linkError } = await supabase
            .from("social_links")
            .select("*");
          if (linkData && !linkError) {
            setSocialLinks(
              linkData.map((l: any) => ({
                id: String(l.id),
                name: l.name,
                url: l.url,
                icon: l.icon,
              })),
            );
          }
        } catch (e) {
          console.warn("Failed to load social links:", e);
        }

        try {
          const { data: compData, error: compError } = await supabase
            .from("company_settings")
            .select("*")
            .single();
          if (compData && !compError) {
            setCompanySettings(compData);
            setCompanyEditData(compData);
          }
        } catch (e) {
          console.warn("Failed to load company settings:", e);
        }
      }

      if (supabase) {
        try {
          const { data: vacData, error: vacError } = await supabase
            .from("vacancies")
            .select("*")
            .order("created_at", { ascending: false });
          if (vacData && !vacError) {
            setVacancies(
              vacData.map((v: any) => ({
                id: String(v.id),
                title: v.title,
                responsibilities: v.responsibilities,
                skills: v.skills,
                status: v.status || "Active",
              })),
            );
          }
        } catch (e) {
          console.warn("Failed to load vacancies:", e);
        }

        try {
          const { data: appData, error: appError } = await supabase
            .from("applications")
            .select("*")
            .order("created_at", { ascending: false });
          if (appData && !appError) {
            setApplications(appData);
          }
        } catch (e) {
          console.warn("Failed to load applications:", e);
        }
      }
    }

    loadData();

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
          },
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, isAdmin]);

  // If still loading session from Supabase, show a loading spinner
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-ink">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If the auth state is resolved and no user is found, redirect to login
  if (!user) {
    return <Navigate to="/login" search={{ redirect: "/admin" }} replace />;
  }

  // If the user is not the configured admin, redirect away
  if (!isAdmin) {
    // Optionally navigate to a safe page
    return <Navigate to="/contact" replace />;
  }

  // Open slide-in to add a new project
  const openAddProjectModal = () => {
    setShowAddProject(true);
  };

  // Show a toast notification
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Handle saving company settings
  const handleSaveCompanySettings = async () => {
    if (!companyEditData.address || !companyEditData.map_embed_url) {
      showToast("Address and Map URL are required", "error");
      return;
    }
    setSaveCompanyLoading(true);
    try {
      const { error } = await supabase
        .from("company_settings")
        .update({
          address: companyEditData.address,
          map_embed_url: companyEditData.map_embed_url,
          phone1: companyEditData.phone1,
          phone2: companyEditData.phone2,
        })
        .eq("id", 1);
      if (error) throw error;
      setCompanySettings(companyEditData);
      setIsEditingCompany(false);
      showToast("Company settings updated!", "success");
    } catch (e: any) {
      console.warn("Save company settings error:", e);
      showToast(e?.message || "Failed to update settings", "error");
    } finally {
      setSaveCompanyLoading(false);
    }
  };

  // Handle submission of the new project form
  const handleAddProjectSubmit = async () => {
    const { name, description, category, status, userCount, uptime, github_link, live_link } =
      newProjectData;
    if (!name) {
      showToast("Project name is required", "error");
      return;
    }
    setAddProjectLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          name,
          description,
          category,
          status,
          uptime,
          usercount: userCount,
          github_link,
          live_link,
        })
        .select()
        .single();
      if (error) throw error;
      setProjects((prev) => [
        ...prev,
        {
          id: String(data.id),
          name: data.name,
          description: data.description || "",
          category: data.category,
          status: data.status,
          userCount: data.userCount || "0",
          uptime: data.uptime || "0%",
          github_link: data.github_link || "",
          live_link: data.live_link || "",
        },
      ]);
      setShowAddProject(false);
      setNewProjectData({
        name: "",
        description: "",
        category: "",
        status: "Active",
        userCount: "0",
        uptime: "0%",
        github_link: "",
        live_link: "",
      });
      showToast("Project added successfully!", "success");
    } catch (e: any) {
      console.warn("Add project error:", e);
      showToast(e?.message || "Failed to add project", "error");
    } finally {
      setAddProjectLoading(false);
    }
  };

  const editProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    setEditingProject({ ...proj });
  };

  const handleEditProjectSubmit = async () => {
    if (!editingProject) return;
    setEditProjectLoading(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          name: editingProject.name,
          description: editingProject.description,
          category: editingProject.category,
          status: editingProject.status,
          uptime: editingProject.uptime,
          usercount: editingProject.userCount,
          github_link: editingProject.github_link,
          live_link: editingProject.live_link,
        })
        .eq("id", editingProject.id);
      if (error) throw error;
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? { ...editingProject } : p)),
      );
      setEditingProject(null);
      showToast("Project updated successfully!", "success");
    } catch (e: any) {
      console.warn("Edit project error:", e);
      showToast(e?.message || "Failed to update project", "error");
    } finally {
      setEditProjectLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    setDeletingProjectId(id);
  };

  const confirmDeleteProject = async () => {
    if (!deletingProjectId) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase.from("projects").delete().eq("id", deletingProjectId);
      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== deletingProjectId));
      showToast("Project deleted", "success");
    } catch (e: any) {
      console.warn("Delete project error:", e);
      showToast(e?.message || "Failed to delete project", "error");
    } finally {
      setDeletingProjectId(null);
      setDeleteLoading(false);
    }
  };

  const openAddSocialLinkModal = () => {
    setNewSocialLinkData({ name: "", url: "", icon: "Link" });
    setShowAddSocialLink(true);
  };

  const handleAddSocialLinkSubmit = async () => {
    const { name, url, icon } = newSocialLinkData;
    if (!name) {
      showToast("Link name is required", "error");
      return;
    }
    setAddSocialLinkLoading(true);
    try {
      const { data, error } = await supabase
        .from("social_links")
        .insert({ name, url, icon })
        .select()
        .single();
      if (error) throw error;
      setSocialLinks((prev) => [...prev, data as any]);
      setShowAddSocialLink(false);
      showToast("Social link added!", "success");
    } catch (e: any) {
      console.warn("Add social link error:", e);
      showToast(e?.message || "Failed to add social link", "error");
    } finally {
      setAddSocialLinkLoading(false);
    }
  };

  const editSocialLink = (id: string) => {
    const link = socialLinks.find((l) => l.id === id);
    if (!link) return;
    setEditingSocialLink({ ...link });
  };

  const handleEditSocialLinkSubmit = async () => {
    if (!editingSocialLink) return;
    setEditSocialLinkLoading(true);
    try {
      const { error } = await supabase
        .from("social_links")
        .update({
          name: editingSocialLink.name,
          url: editingSocialLink.url,
          icon: editingSocialLink.icon,
        })
        .eq("id", editingSocialLink.id);
      if (error) throw error;
      setSocialLinks((prev) =>
        prev.map((l) => (l.id === editingSocialLink.id ? { ...editingSocialLink } : l)),
      );
      setEditingSocialLink(null);
      showToast("Social link updated!", "success");
    } catch (e: any) {
      console.warn("Edit social link error:", e);
      showToast(e?.message || "Failed to update social link", "error");
    } finally {
      setEditSocialLinkLoading(false);
    }
  };

  const deleteSocialLink = (id: string) => {
    setDeletingSocialLinkId(id);
  };

  const confirmDeleteSocialLink = async () => {
    if (!deletingSocialLinkId) return;
    setDeleteSocialLinkLoading(true);
    try {
      const { error } = await supabase.from("social_links").delete().eq("id", deletingSocialLinkId);
      if (error) throw error;
      setSocialLinks((prev) => prev.filter((l) => l.id !== deletingSocialLinkId));
      showToast("Social link deleted", "success");
    } catch (e: any) {
      console.warn("Delete social link error:", e);
      showToast(e?.message || "Failed to delete social link", "error");
    } finally {
      setDeletingSocialLinkId(null);
      setDeleteSocialLinkLoading(false);
    }
  };

  const handleAddVacancySubmit = async () => {
    const { title, responsibilities, skills, status } = newVacancyData;
    if (!title || !responsibilities || !skills) {
      showToast("All fields are required", "error");
      return;
    }
    setAddVacancyLoading(true);
    try {
      const { data, error } = await supabase
        .from("vacancies")
        .insert({ title, responsibilities, skills, status })
        .select()
        .single();
      if (error) throw error;
      setVacancies((prev) => [
        {
          id: String(data.id),
          title: data.title,
          responsibilities: data.responsibilities,
          skills: data.skills,
          status: data.status,
        },
        ...prev,
      ]);
      setShowAddVacancy(false);
      setNewVacancyData({ title: "", responsibilities: "", skills: "", status: "Active" });
      showToast("Vacancy added!", "success");
    } catch (e: any) {
      console.warn("Add vacancy error:", e);
      showToast(e?.message || "Failed to add vacancy", "error");
    } finally {
      setAddVacancyLoading(false);
    }
  };

  const toggleApplicationStatus = async (id: string, newStatus: string) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
    try {
      await supabase.from("applications").update({ status: newStatus }).eq("id", id);
    } catch (e) {
      console.warn("Failed to update status", e);
    }
  };

  const confirmDeleteApplication = async () => {
    if (!deleteApplicationId) return;
    setDeleteAppLoading(true);
    try {
      const { error } = await supabase.from("applications").delete().eq("id", deleteApplicationId);
      if (error) throw error;
      setApplications((prev) => prev.filter((a) => a.id !== deleteApplicationId));
      showToast("Application deleted", "success");
    } catch (e: any) {
      showToast(e?.message || "Failed to delete application", "error");
    } finally {
      setDeleteApplicationId(null);
      setDeleteAppLoading(false);
    }
  };

  const confirmDeleteVacancy = async () => {
    if (!deletingVacancyId) return;
    setDeleteVacancyLoading(true);
    try {
      const { error } = await supabase.from("vacancies").delete().eq("id", deletingVacancyId);
      if (error) throw error;
      setVacancies((prev) => prev.filter((v) => v.id !== deletingVacancyId));
      showToast("Vacancy deleted", "success");
    } catch (e: any) {
      console.warn("Delete vacancy error:", e);
      showToast(e?.message || "Failed to delete vacancy", "error");
    } finally {
      setDeletingVacancyId(null);
      setDeleteVacancyLoading(false);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || msg.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleStatus = async (id: string, newStatus: "new" | "replied" | "archived") => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
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
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="container-page py-10 sm:py-14">
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
              <p className="text-xs text-muted-foreground">
                Logged in as {user.name} ({user.email})
              </p>
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

        <div className="mt-6 flex items-center gap-2 overflow-x-auto border-b border-border pb-3 scrollbar-none">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            {
              id: "inbox",
              label: `Inbox (${messages.filter((m) => m.status === "new").length})`,
              icon: Mail,
            },
            { id: "projects", label: "Projects", icon: FolderKanban },
            { id: "social", label: "Social Links", icon: Share2 },
            { id: "careers", label: "Careers", icon: Briefcase },
            { id: "applications", label: "Applications", icon: FileText },
            { id: "settings", label: "Settings", icon: SlidersHorizontal },
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

        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Total Inquiries",
                  value: messages.length.toString(),
                  change: "From contact form",
                  icon: Mail,
                  color: "text-blue-600 bg-blue-50",
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.title}
                    className="rounded-3xl border border-border bg-surface p-6 shadow-soft"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {stat.title}
                      </span>
                      <div className={`p-2.5 rounded-2xl ${stat.color}`}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <p className="mt-4 font-display text-3xl font-extrabold text-ink">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                );
              })}
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <h3 className="font-display text-lg font-bold text-ink">
                    Recent Contact Messages
                  </h3>
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

        {activeTab === "inbox" && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-3xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, subject..."
                    className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-xs outline-none focus:border-primary"
                  />
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
                    <p className="mt-1 text-xs font-semibold text-primary truncate">
                      {msg.subject}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
              {selectedMessage ? (
                <div>
                  <div className="flex items-start justify-between border-b border-border/60 pb-4">
                    <div>
                      <h3 className="font-display text-xl font-bold text-ink">
                        {selectedMessage.subject}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        From: <strong className="text-ink">{selectedMessage.name}</strong> (
                        {selectedMessage.email})
                      </p>
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

        {activeTab === "projects" && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-ink">Projects</h2>
              <button
                className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                onClick={openAddProjectModal}
              >
                Add Project
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-3xl border border-border bg-surface p-4 shadow-soft"
                >
                  <h3 className="font-medium text-ink">{proj.name}</h3>
                  {proj.description && (
                    <p className="text-sm text-muted-foreground mb-1">{proj.description}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{proj.category}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Status: {proj.status}</p>

                  <div className="mt-2 flex gap-3 text-xs">
                    {proj.github_link && (
                      <a
                        href={proj.github_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        GitHub <ArrowUpRight size={12} />
                      </a>
                    )}
                    {proj.live_link && (
                      <a
                        href={proj.live_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Live <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      className="rounded bg-amber-500 px-2 py-1 text-xs text-white"
                      onClick={() => editProject(proj.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded bg-destructive px-2 py-1 text-xs text-white"
                      onClick={() => deleteProject(proj.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slide-in toast panel for adding a project */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
            showAddProject ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-display text-lg font-bold text-ink">Add New Project</h2>
              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                className="rounded-full p-1.5 hover:bg-gray-100 transition-colors text-muted-foreground hover:text-ink"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Project Name *
                  </label>
                  <input
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="e.g. MediQueue SaaS"
                    value={newProjectData.name}
                    onChange={(e) =>
                      setNewProjectData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Description</label>
                  <textarea
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                    placeholder="Brief project description..."
                    rows={3}
                    value={newProjectData.description}
                    onChange={(e) =>
                      setNewProjectData((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Category</label>
                  <select
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    value={newProjectData.category}
                    onChange={(e) =>
                      setNewProjectData((prev) => ({ ...prev, category: e.target.value }))
                    }
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    <option value="Flagship">Flagship</option>
                    <option value="SaaS & Enterprise">SaaS & Enterprise</option>
                    <option value="Fintech">Fintech</option>
                    <option value="EdTech">EdTech</option>
                    <option value="AI & Automation">AI & Automation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">Status</label>
                  <select
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    value={newProjectData.status}
                    onChange={(e) =>
                      setNewProjectData((prev) => ({ ...prev, status: e.target.value }))
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Planned">Planned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    GitHub Link (Optional)
                  </label>
                  <input
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="https://github.com/..."
                    value={newProjectData.github_link}
                    onChange={(e) =>
                      setNewProjectData((prev) => ({ ...prev, github_link: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Live Link (Optional)
                  </label>
                  <input
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="https://..."
                    value={newProjectData.live_link}
                    onChange={(e) =>
                      setNewProjectData((prev) => ({ ...prev, live_link: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-border p-5 flex items-center gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-ink hover:bg-gray-50 transition-colors"
                onClick={() => setShowAddProject(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                onClick={handleAddProjectSubmit}
                disabled={addProjectLoading}
              >
                {addProjectLoading ? "Adding..." : "Add Project"}
              </button>
            </div>
          </div>
        </div>
        {/* Backdrop when slide-in is open */}
        {showAddProject && (
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowAddProject(false)}
          />
        )}

        {/* Edit Project slide-in panel */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
            editingProject ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {editingProject && (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b border-border p-5">
                <h2 className="font-display text-lg font-bold text-ink">Edit Project</h2>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="rounded-full p-1.5 hover:bg-gray-100 transition-colors text-muted-foreground hover:text-ink"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Project Name *
                    </label>
                    <input
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      value={editingProject.name}
                      onChange={(e) =>
                        setEditingProject((prev) =>
                          prev ? { ...prev, name: e.target.value } : null,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Description
                    </label>
                    <textarea
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-none"
                      rows={3}
                      value={editingProject.description || ""}
                      onChange={(e) =>
                        setEditingProject((prev) =>
                          prev ? { ...prev, description: e.target.value } : null,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">Category</label>
                    <select
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                      value={editingProject.category}
                      onChange={(e) =>
                        setEditingProject((prev) =>
                          prev ? { ...prev, category: e.target.value } : null,
                        )
                      }
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      <option value="Flagship">Flagship</option>
                      <option value="SaaS & Enterprise">SaaS & Enterprise</option>
                      <option value="Fintech">Fintech</option>
                      <option value="EdTech">EdTech</option>
                      <option value="AI & Automation">AI & Automation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">Status</label>
                    <select
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                      value={editingProject.status}
                      onChange={(e) =>
                        setEditingProject((prev) =>
                          prev ? { ...prev, status: e.target.value } : null,
                        )
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Planned">Planned</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      GitHub Link (Optional)
                    </label>
                    <input
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      placeholder="https://github.com/..."
                      value={editingProject.github_link || ""}
                      onChange={(e) =>
                        setEditingProject((prev) =>
                          prev ? { ...prev, github_link: e.target.value } : null,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Live Link (Optional)
                    </label>
                    <input
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      placeholder="https://..."
                      value={editingProject.live_link || ""}
                      onChange={(e) =>
                        setEditingProject((prev) =>
                          prev ? { ...prev, live_link: e.target.value } : null,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="border-t border-border p-5 flex items-center gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-ink hover:bg-gray-50 transition-colors"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  onClick={handleEditProjectSubmit}
                  disabled={editProjectLoading}
                >
                  {editProjectLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
        {editingProject && (
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setEditingProject(null)} />
        )}

        
        {/* Add Vacancy Modal */}
        {showAddVacancy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-lift relative">
              <button
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-gray-100 transition-colors"
                onClick={() => setShowAddVacancy(false)}
              >
                ✕
              </button>
              <h3 className="text-xl font-bold text-ink mb-4">Add New Vacancy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Job Title</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    value={newVacancyData.title}
                    onChange={(e) => setNewVacancyData({ ...newVacancyData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Responsibilities</label>
                  <textarea
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary min-h-[80px]"
                    value={newVacancyData.responsibilities}
                    onChange={(e) => setNewVacancyData({ ...newVacancyData, responsibilities: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Skills & Qualifications</label>
                  <textarea
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary min-h-[80px]"
                    value={newVacancyData.skills}
                    onChange={(e) => setNewVacancyData({ ...newVacancyData, skills: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-2 font-semibold text-muted-foreground hover:bg-gray-50 transition-colors"
                    onClick={() => setShowAddVacancy(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                    onClick={async () => {
                      setAddVacancyLoading(true);
                      try {
                        const { data, error } = await supabase.from("vacancies").insert({
                          title: newVacancyData.title,
                          responsibilities: newVacancyData.responsibilities,
                          skills: newVacancyData.skills,
                          status: "Active"
                        }).select();
                        if (!error && data) {
                          setVacancies([{
                            id: String(data[0].id),
                            title: data[0].title,
                            responsibilities: data[0].responsibilities,
                            skills: data[0].skills,
                            status: data[0].status
                          }, ...vacancies]);
                          setShowAddVacancy(false);
                          setNewVacancyData({ title: "", responsibilities: "", skills: "", status: "Active" });
                          setToast({ type: "success", message: "Vacancy added successfully!" });
                        }
                      } catch(e) {
                        console.error(e);
                      }
                      setAddVacancyLoading(false);
                    }}
                    disabled={addVacancyLoading}
                  >
                    {addVacancyLoading ? "Saving..." : "Save Vacancy"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Vacancy Modal */}
        {editingVacancy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-lift relative">
              <button
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-gray-100 transition-colors"
                onClick={() => setEditingVacancy(null)}
              >
                ✕
              </button>
              <h3 className="text-xl font-bold text-ink mb-4">Edit Vacancy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Job Title</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    value={editingVacancy.title}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Responsibilities</label>
                  <textarea
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary min-h-[80px]"
                    value={editingVacancy.responsibilities}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, responsibilities: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Skills & Qualifications</label>
                  <textarea
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary min-h-[80px]"
                    value={editingVacancy.skills}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, skills: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <select
                    className="w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    value={editingVacancy.status}
                    onChange={(e) => setEditingVacancy({ ...editingVacancy, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-2 font-semibold text-muted-foreground hover:bg-gray-50 transition-colors"
                    onClick={() => setEditingVacancy(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                    onClick={async () => {
                      setEditVacancyLoading(true);
                      try {
                        const { error } = await supabase.from("vacancies").update({
                          title: editingVacancy.title,
                          responsibilities: editingVacancy.responsibilities,
                          skills: editingVacancy.skills,
                          status: editingVacancy.status
                        }).eq("id", editingVacancy.id);
                        if (!error) {
                          setVacancies(vacancies.map(v => v.id === editingVacancy.id ? editingVacancy : v));
                          setEditingVacancy(null);
                          setToast({ type: "success", message: "Vacancy updated successfully!" });
                        } else {
                          setToast({ type: "error", message: "Failed to update vacancy." });
                        }
                      } catch(e) {
                        console.error(e);
                        setToast({ type: "error", message: "Failed to update vacancy." });
                      }
                      setEditVacancyLoading(false);
                    }}
                    disabled={editVacancyLoading}
                  >
                    {editVacancyLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Vacancy Confirmation */}
        {deletingVacancyId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-surface rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl">
              <h3 className="font-display text-lg font-bold text-ink">Delete Vacancy?</h3>
              <p className="mt-2 text-sm text-muted-foreground">This action cannot be undone.</p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-gray-50 transition-colors"
                  onClick={() => setDeletingVacancyId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                  onClick={async () => {
                    setDeleteVacancyLoading(true);
                    try {
                      await supabase.from("vacancies").delete().eq("id", deletingVacancyId);
                      setVacancies(vacancies.filter((v) => v.id !== deletingVacancyId));
                      setToast({ type: "success", message: "Vacancy deleted." });
                      setDeletingVacancyId(null);
                    } catch(e) {}
                    setDeleteVacancyLoading(false);
                  }}
                  disabled={deleteVacancyLoading}
                >
                  {deleteVacancyLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Delete Application Confirmation */}
        {deleteApplicationId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-surface rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl">
              <h3 className="font-display text-lg font-bold text-ink">Delete Application?</h3>
              <p className="mt-2 text-sm text-muted-foreground">This action cannot be undone.</p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-gray-50 transition-colors"
                  onClick={() => setDeleteApplicationId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                  onClick={async () => {
                    setDeleteAppLoading(true);
                    try {
                      await supabase.from("applications").delete().eq("id", deleteApplicationId);
                      setApplications(applications.filter((a) => a.id !== deleteApplicationId));
                      setToast({ type: "success", message: "Application deleted." });
                      setDeleteApplicationId(null);
                    } catch(e) {}
                    setDeleteAppLoading(false);
                  }}
                  disabled={deleteAppLoading}
                >
                  {deleteAppLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Delete confirmation dialog */}
        {deletingProjectId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-surface rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl">
              <h3 className="font-display text-lg font-bold text-ink">Delete Project?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This action cannot be undone. The project will be permanently removed.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-ink hover:bg-gray-50 transition-colors"
                  onClick={() => setDeletingProjectId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                  onClick={confirmDeleteProject}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-ink">Social Media Links</h2>
              <button
                className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                onClick={openAddSocialLinkModal}
              >
                Add Link
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {socialLinks.map((link) => (
                <div
                  key={link.id}
                  className="rounded-3xl border border-border bg-surface p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="font-medium text-ink mb-1">{link.name}</div>
                    <a
                      href={link.url}
                      className="text-primary hover:underline text-sm truncate block"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.url}
                    </a>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      className="rounded bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-600"
                      onClick={() => editSocialLink(link.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded bg-destructive px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                      onClick={() => deleteSocialLink(link.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Tab 4: Settings & Health */}

        {activeTab === "careers" && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-ink">Careers / Vacancies</h2>
              <button
                className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                onClick={() => setShowAddVacancy(true)}
              >
                Add Vacancy
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {vacancies.map((vac) => (
                <div
                  key={vac.id}
                  className="rounded-3xl border border-border bg-surface p-5 shadow-soft flex flex-col"
                >
                  <h3 className="font-bold text-lg text-ink">{vac.title}</h3>
                  <div className="mt-2 space-y-2 flex-grow">
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        Responsibilities
                      </span>
                      <p className="text-xs text-ink line-clamp-3">{vac.responsibilities}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground">Skills</span>
                      <p className="text-xs text-ink line-clamp-3">{vac.skills}</p>
                    </div>
                    <p className="text-xs font-semibold mt-2">Status: {vac.status}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setEditingVacancy(vac)}
                      className="text-xs text-primary hover:underline font-medium px-2 py-1 bg-primary/10 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingVacancyId(vac.id)}
                      className="text-xs text-destructive hover:underline font-medium px-2 py-1 bg-destructive/10 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {vacancies.length === 0 && (
                <div className="col-span-3 text-center text-muted-foreground py-10">
                  No vacancies found.
                </div>
              )}
            </div>
          </div>
        )}

        
        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-ink">Job Applications</h2>
            </div>
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="text-center text-muted-foreground py-10 bg-surface rounded-3xl border border-border">
                  No applications received yet.
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-ink">{app.first_name} {app.last_name}</h3>
                      <p className="text-sm font-semibold text-primary">{app.job_title}</p>
                      <div className="text-sm text-muted-foreground mt-1">
                        <p>{app.email}</p>
                        {app.portfolio_url && (
                          <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Portfolio Link</a>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
                      {app.resume_url && (
                        <a 
                          href={app.resume_url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          View Resume
                        </a>
                      )}
                      <select 
                        value={app.status || "new"}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: newStatus } : a));
                          supabase.from("applications").update({ status: newStatus }).eq("id", app.id)
                            .then(() => setToast({ type: "success", message: "Status updated" }))
                            .catch(() => setToast({ type: "error", message: "Failed to update status" }));
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-border"
                      >
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                      <button
                        onClick={() => setDeleteApplicationId(app.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}


        {activeTab === "settings" && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
              <h3 className="font-display text-xl font-bold text-ink border-b border-border/60 pb-4">
                Server & Auth Health Status
              </h3>
              <div className="mt-6 space-y-4 text-xs text-ink">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-border p-4 bg-background">
                  <span>Supabase Google Auth Provider</span>
                  <span className="font-bold text-emerald-600">
                    Connected (yayoyrouufztwxygsuph)
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-border p-4 bg-background">
                  <span>EmailJS Notification Service</span>
                  <span className="font-bold text-emerald-600">Active (service_taaea0d)</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft">
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <h3 className="font-display text-xl font-bold text-ink">Company Settings</h3>
                {!isEditingCompany && (
                  <button
                    onClick={() => setIsEditingCompany(true)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Edit
                  </button>
                )}
              </div>

              <div className="mt-6 text-sm">
                {isEditingCompany ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1.5">
                        Company Address
                      </label>
                      <input
                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                        value={companyEditData.address}
                        onChange={(e) =>
                          setCompanyEditData((prev) => ({ ...prev, address: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink mb-1.5">
                        Google Maps Embed URL
                      </label>
                      <input
                        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                        value={companyEditData.map_embed_url}
                        onChange={(e) =>
                          setCompanyEditData((prev) => ({ ...prev, map_embed_url: e.target.value }))
                        }
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-ink mb-1.5">
                          Primary Phone
                        </label>
                        <input
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                          value={companyEditData.phone1 || ""}
                          onChange={(e) =>
                            setCompanyEditData((prev) => ({ ...prev, phone1: e.target.value }))
                          }
                          placeholder="+977 98..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink mb-1.5">
                          Secondary Phone
                        </label>
                        <input
                          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                          value={companyEditData.phone2 || ""}
                          onChange={(e) =>
                            setCompanyEditData((prev) => ({ ...prev, phone2: e.target.value }))
                          }
                          placeholder="+977 98..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveCompanySettings}
                        disabled={saveCompanyLoading}
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90"
                      >
                        {saveCompanyLoading ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingCompany(false);
                          setCompanyEditData(
                            companySettings || {
                              id: 1,
                              address: "Kathmandu, Nepal",
                              map_embed_url: "https://www.google.com/maps?q=Kamalpokhari,+Kathmandu,+Nepal&output=embed",
                              phone1: "+977 986-6291003",
                              phone2: "+977 986-3479066",
                            },
                          );
                        }}
                        className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-ink hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs text-ink">
                    <div className="rounded-2xl border border-border p-4 bg-background">
                      <div className="font-semibold text-muted-foreground mb-1">
                        Company Address
                      </div>
                      <div className="font-medium text-ink">
                        {companySettings?.address || "Kathmandu, Nepal (Default)"}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border p-4 bg-background">
                      <div className="font-semibold text-muted-foreground mb-1">Map Embed URL</div>
                      <div
                        className="font-medium text-ink truncate"
                        title={companySettings?.map_embed_url}
                      >
                        {companySettings?.map_embed_url || "https://www.google.com/maps?q=Kamalpokhari,+Kathmandu,+Nepal&output=embed (Default)"}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-border p-4 bg-background">
                        <div className="font-semibold text-muted-foreground mb-1">
                          Primary Phone
                        </div>
                        <div className="font-medium text-ink">
                          {companySettings?.phone1 || "+977 986-6291003 (Default)"}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border p-4 bg-background">
                        <div className="font-semibold text-muted-foreground mb-1">
                          Secondary Phone
                        </div>
                        <div className="font-medium text-ink">
                          {companySettings?.phone2 || "+977 986-3479066 (Default)"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Slide-in toast panel for adding a social link */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
            showAddSocialLink ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-display text-lg font-bold text-ink">Add Social Link</h2>
              <button
                type="button"
                onClick={() => setShowAddSocialLink(false)}
                className="rounded-full p-1.5 hover:bg-gray-100 transition-colors text-muted-foreground hover:text-ink"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Platform Name *
                  </label>
                  <select
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                    value={newSocialLinkData.name}
                    onChange={(e) => {
                      const platform = SOCIAL_PLATFORMS.find((p) => p.name === e.target.value);
                      setNewSocialLinkData((prev) => ({
                        ...prev,
                        name: platform ? platform.name : e.target.value,
                        icon: platform ? platform.icon : prev.icon,
                      }));
                    }}
                  >
                    <option value="" disabled>
                      Select a platform
                    </option>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <option key={platform.name} value={platform.name}>
                        {platform.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">URL</label>
                  <input
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="https://..."
                    value={newSocialLinkData.url}
                    onChange={(e) =>
                      setNewSocialLinkData((prev) => ({ ...prev, url: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-border p-5 flex items-center gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-ink hover:bg-gray-50 transition-colors"
                onClick={() => setShowAddSocialLink(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                onClick={handleAddSocialLinkSubmit}
                disabled={addSocialLinkLoading}
              >
                {addSocialLinkLoading ? "Adding..." : "Add Link"}
              </button>
            </div>
          </div>
        </div>
        {showAddSocialLink && (
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowAddSocialLink(false)}
          />
        )}

        {/* Edit Social Link slide-in panel */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
            editingSocialLink ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {editingSocialLink && (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between border-b border-border p-5">
                <h2 className="font-display text-lg font-bold text-ink">Edit Social Link</h2>
                <button
                  type="button"
                  onClick={() => setEditingSocialLink(null)}
                  className="rounded-full p-1.5 hover:bg-gray-100 transition-colors text-muted-foreground hover:text-ink"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Platform Name *
                    </label>
                    <select
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary transition-all"
                      value={editingSocialLink.name}
                      onChange={(e) => {
                        const platform = SOCIAL_PLATFORMS.find((p) => p.name === e.target.value);
                        setEditingSocialLink((prev) =>
                          prev
                            ? {
                                ...prev,
                                name: platform ? platform.name : e.target.value,
                                icon: platform ? platform.icon : prev.icon,
                              }
                            : null,
                        );
                      }}
                    >
                      <option value="" disabled>
                        Select a platform
                      </option>
                      {SOCIAL_PLATFORMS.map((platform) => (
                        <option key={platform.name} value={platform.name}>
                          {platform.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">URL</label>
                    <input
                      className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                      value={editingSocialLink.url}
                      onChange={(e) =>
                        setEditingSocialLink((prev) =>
                          prev ? { ...prev, url: e.target.value } : null,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="border-t border-border p-5 flex items-center gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-ink hover:bg-gray-50 transition-colors"
                  onClick={() => setEditingSocialLink(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  onClick={handleEditSocialLinkSubmit}
                  disabled={editSocialLinkLoading}
                >
                  {editSocialLinkLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
        {editingSocialLink && (
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setEditingSocialLink(null)}
          />
        )}

        {/* Delete confirmation dialog */}
        {deletingSocialLinkId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-surface rounded-2xl border border-border p-6 w-full max-w-sm shadow-2xl">
              <h3 className="font-display text-lg font-bold text-ink">Delete Social Link?</h3>
              <p className="mt-2 text-sm text-muted-foreground">This action cannot be undone.</p>
              <div className="mt-5 flex items-center gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-ink hover:bg-gray-50 transition-colors"
                  onClick={() => setDeletingSocialLinkId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                  onClick={confirmDeleteSocialLink}
                  disabled={deleteSocialLinkLoading}
                >
                  {deleteSocialLinkLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-lg animate-[slideUp_0.3s_ease-out] ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          style={{ animation: "slideUp 0.3s ease-out" }}
        >
          <span>{toast.type === "success" ? "✓" : "✕"}</span>
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
}

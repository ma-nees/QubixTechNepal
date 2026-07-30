import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Clock, Facebook, Github, Linkedin, Mail, MapPin, Phone, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { PageShell, PageHero, SectionHeading, CtaBand } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import flagUrl from "@/assets/nepal-flag.gif";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Qubix Tech Nepal" },
      {
        name: "description",
        content:
          "Talk to Qubix Tech Nepal about software, SaaS, AI and digital products. Kathmandu office, phone, email, business hours and FAQ.",
      },
      { property: "og:title", content: "Contact — Qubix Tech Nepal" },
      { property: "og:description", content: "Let's build something meaningful together." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

const faqs = [
  ["How quickly can you start?", "Most engagements begin within two to three weeks of a signed scope, sooner for discovery work."],
  ["Do you work with clients outside Nepal?", "Yes. We deliver for teams across Asia, Europe and Australia with overlapping working hours."],
  ["Can you take over an existing codebase?", "Often. We start with an architecture and security review, then propose a stabilisation plan."],
  ["Do you offer ongoing support?", "Yes — support and maintenance retainers include monitoring, patching and a response SLA."],
] as const;

import { useAuth } from "@/lib/auth-context";

export function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { user, openAuthModal, logout } = useAuth();

  // EmailJS configuration (Reads securely from environment variables)
  const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
  const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
  const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      console.log("EmailJS Success:", res);
      setStatus({
        type: "success",
        text: "Thank you! Your message has been sent. We'll reply to you soon.",
      });
      formRef.current.reset();
    } catch (err: unknown) {
      console.error("EmailJS Submission Error:", err);
      const errorMsg =
        typeof err === "object" && err !== null && "text" in err
          ? String((err as { text: string }).text)
          : "Failed to send email. Please verify your EmailJS template settings.";
      setStatus({
        type: "error",
        text: `EmailJS Error: ${errorMsg}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title="Let's Build Something Meaningful Together."
        subtitle="Tell us what you're trying to solve. We'll reply within one business day with next steps."
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <img src={flagUrl} alt="Flag of Nepal" loading="lazy" className="h-4 w-auto" />
          Kathmandu, Nepal
        </span>
      </PageHero>

      <section className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          {!user ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface p-8 text-center shadow-soft sm:p-12">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>

              <h2 className="mt-5 font-display text-2xl font-extrabold text-ink">Sign in to send a message</h2>
              <p className="mt-2.5 max-w-md text-sm leading-relaxed text-muted-foreground">
                To prevent spam and verify your email, you must sign in with your Google account before filling out the contact form.
              </p>

              <Link
                to="/login"
                search={{ redirect: "/contact" }}
                className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-[#4285F4] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#3367D6]"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                </svg>
                Sign in with Google
              </Link>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="rounded-3xl border border-border bg-surface p-6 shadow-soft sm:p-8"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-extrabold text-ink">Send us a message</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">Authenticated via Google Account</p>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl bg-secondary/60 px-3.5 py-1.5 border border-border/60">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="size-6 rounded-full object-cover" />
                  ) : null}
                  <span className="text-xs font-bold text-ink">{user.email}</span>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-[11px] font-semibold text-muted-foreground hover:text-destructive transition-colors ml-1"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Hidden field for {{time}} variable in EmailJS template */}
              <input type="hidden" name="time" value={new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })} />

              <div className="mt-6 grid gap-4 sm:gap-5">
                <div className="grid gap-2">
                  <label htmlFor="full_name" className="text-sm font-medium text-ink">
                    Full name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    required
                    defaultValue={user.name}
                    className="h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none focus:border-primary"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-ink">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      readOnly
                      defaultValue={user.email}
                      className="h-11 rounded-xl border border-input bg-muted/60 px-4 text-sm font-medium text-muted-foreground outline-none cursor-not-allowed"
                    />
                  </div>
                <div className="grid gap-2">
                  <label htmlFor="phone" className="text-sm font-medium text-ink">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary"
                    placeholder="+977 98XXXXXXX"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label htmlFor="subject" className="text-sm font-medium text-ink">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  className="h-11 rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary"
                  placeholder="What can we help with?"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-medium text-ink">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Tell us about your project, timeline and goals."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending message...
                  </>
                ) : (
                  <>
                    <Send size={16} aria-hidden="true" />
                    Send message
                  </>
                )}
              </button>

              {status && (
                <div
                  className={`flex items-start gap-2.5 rounded-xl p-3.5 text-xs font-semibold ${status.type === "success"
                      ? "bg-secondary/70 text-ink border border-primary/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                    }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
                  ) : (
                    <AlertCircle size={16} className="mt-0.5 shrink-0 text-destructive" />
                  )}
                  <span>{status.text}</span>
                </div>
              )}
            </div>
          </form>
          )}
        </Reveal>

        <div className="grid content-start gap-5">
          <Reveal delay={80}>
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
              <h2 className="font-display text-xl font-bold text-ink">Reach us directly</h2>
              <ul className="mt-5 grid gap-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  Kamalpokhari, Kathmandu 44600, Nepal
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  <a href="tel:+9779866291003" className="hover:text-ink">
                    +977 986-6291003
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  <a href="tel:+9779863479066" className="hover:text-ink">
                    +977 986-3479066
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  <a href="mailto:qubixtechnepal@gmail.com" className="hover:text-ink">
                    qubixtechnepal@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                  <span>
                    Sunday – Friday, 9:00 AM – 6:00 PM NPT
                    <br />
                    Saturday closed · Emergency support 24/7
                  </span>
                </li>
              </ul>
              <ul className="mt-6 flex gap-2">
                {[
                  [Linkedin, "LinkedIn"],
                  [Facebook, "Facebook"],
                  [Github, "GitHub"],
                ].map(([Icon, label]) => {
                  const I = Icon as typeof Linkedin;
                  return (
                    <li key={label as string}>
                      <a
                        href="#"
                        aria-label={label as string}
                        className="grid size-11 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-ink"
                      >
                        <I size={16} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="overflow-hidden rounded-3xl border border-border bg-surface">
              <iframe
                title="Qubix Tech Nepal office location in Kathmandu"
                src="https://www.google.com/maps?q=Kamalpokhari,+Kathmandu,+Nepal&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full border-0"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/25">
        <div className="container-page py-16 sm:py-20">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Questions we're often asked" />
          </Reveal>
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {faqs.map(([q, a], i) => (
              <Reveal as="li" key={q} delay={(i % 2) * 60}>
                <details className="group rounded-2xl border border-border bg-surface p-6">
                  <summary className="cursor-pointer list-none font-display text-base font-bold text-ink marker:hidden">
                    {q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
                </details>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </PageShell>
  );
}

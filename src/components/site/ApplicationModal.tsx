import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2 } from "lucide-react";

export function ApplicationModal({
  jobTitle,
  trigger,
}: {
  jobTitle: string;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const middleName = formData.get("middleName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const portfolio = formData.get("portfolio") as string;
    const resumeFile = formData.get("resume") as File;

    if (!supabase) {
      setErrorMsg("Database connection error.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Check for existing application
      const { data: existingApps, error: checkError } = await supabase
        .from("applications")
        .select("status")
        .eq("email", email)
        .eq("job_title", jobTitle);

      if (checkError) throw checkError;

      if (existingApps && existingApps.length > 0) {
        setErrorMsg(`You have already applied for this position. Your application status is: ${existingApps[0].status || 'Pending'}`);
        setIsSubmitting(false);
        return;
      }

      let resumeUrl = "";

      // Upload Resume to Supabase Storage
      if (resumeFile && resumeFile.size > 0) {
        const fileExt = resumeFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("resumes")
          .upload(fileName, resumeFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("resumes").getPublicUrl(fileName);
        resumeUrl = data.publicUrl;
      }

      // Insert Application to DB
      const { error: dbError } = await supabase.from("applications").insert({
        job_title: jobTitle,
        first_name: firstName,
        middle_name: middleName || null,
        last_name: lastName,
        email,
        portfolio_url: portfolio || null,
        resume_url: resumeUrl,
      });

      if (dbError) throw dbError;

      setIsSuccess(true);

      setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setIsSuccess(false);
          setErrorMsg("");
        }, 300);
      }, 2000);
    } catch (err: any) {
      console.error("Application error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Tell us a bit about yourself. We'll get back to you within 48 hours.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-ink">Application Sent!</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
              Thank you for applying to Qubix Tech Nepal. Our team will review your application
              shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            {errorMsg && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {errorMsg}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First name <span className="text-destructive">*</span>
                </Label>
                <Input id="firstName" name="firstName" required placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle name</Label>
                <Input id="middleName" name="middleName" placeholder="Christ" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last name <span className="text-destructive">*</span>
                </Label>
                <Input id="lastName" name="lastName" required placeholder="Doe" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio or LinkedIn</Label>
                <Input
                  id="portfolio"
                  name="portfolio"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">
                Resume / CV (PDF) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,application/pdf"
                required
                className="cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Submit Application <Send size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

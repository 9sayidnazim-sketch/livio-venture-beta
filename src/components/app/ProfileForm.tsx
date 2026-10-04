import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getUserId, universitiesQuery, type Profile } from "@/lib/app-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Form = {
  full_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  subject: string;
  score: string;
  qualification: string;
  level: string;
  yearly_budget: string;
  ielts_score: string;
  preferred_countries: string[];
};

export function ProfileForm({
  initial,
  defaultEmail,
  onSaved,
  submitLabel = "Save profile",
}: {
  initial: Profile | null;
  defaultEmail?: string;
  onSaved?: () => void;
  submitLabel?: string;
}) {
  const qc = useQueryClient();
  const { data: unis = [] } = useQuery(universitiesQuery);
  const countries = Array.from(new Set(unis.map((u) => u.country))).sort();
  const [f, setF] = useState<Form>({
    full_name: initial?.full_name ?? "",
    email: initial?.email ?? defaultEmail ?? "",
    phone: initial?.phone ?? "",
    city: initial?.city ?? "",
    country: initial?.country ?? "",
    subject: initial?.subject ?? "",
    score: initial?.score?.toString() ?? "",
    qualification: initial?.qualification ?? "",
    level: initial?.level ?? "UG",
    yearly_budget: initial?.yearly_budget?.toString() ?? "",
    ielts_score: initial?.ielts_score?.toString() ?? "",
    preferred_countries: initial?.preferred_countries ?? [],
  });
  const [consent, setConsent] = useState(!!initial);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      toast.error("Please agree to how we use your data.");
      return;
    }
    const score = Number(f.score),
      budget = Number(f.yearly_budget);
    const ielts = f.ielts_score ? Number(f.ielts_score) : null;
    if (score < 0 || score > 100) {
      toast.error("Score must be between 0 and 100.");
      return;
    }
    if (ielts != null && (ielts < 0 || ielts > 9)) {
      toast.error("IELTS must be between 0 and 9.");
      return;
    }
    setBusy(true);
    try {
      const user_id = await getUserId();
      const { error } = await supabase.from("student_profiles").upsert(
        {
          ...f,
          user_id,
          score,
          yearly_budget: budget,
          ielts_score: ielts,
          full_name: f.full_name.trim(),
        },
        { onConflict: "user_id" },
      );
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile saved");
      onSaved?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  const field = (
    k: keyof Form,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} value={f[k] as string} onChange={set(k)} required {...props} />
    </div>
  );

  return (
    <form onSubmit={save} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          About you
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("full_name", "Full name", { maxLength: 100 })}
          {field("email", "Email", { type: "email" })}
          {field("phone", "Phone", { type: "tel", maxLength: 30 })}
          {field("city", "City", { maxLength: 80 })}
          {field("country", "Country of residence", { maxLength: 80 })}
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Studies
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Level</Label>
            <Select value={f.level} onValueChange={(v) => setF({ ...f, level: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UG">Undergraduate (Bachelor's)</SelectItem>
                <SelectItem value="PG">Postgraduate (Master's)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {field("subject", "Subject you want to study", {
            placeholder: "e.g. Computer Science",
            maxLength: 80,
          })}
          {field("qualification", "Latest qualification", {
            placeholder: "e.g. A-Levels, Bachelor's",
            maxLength: 80,
          })}
          {field("score", "Latest score (%)", { type: "number", min: 0, max: 100, step: "0.1" })}
          {field("ielts_score", "IELTS (optional)", {
            type: "number",
            min: 0,
            max: 9,
            step: "0.5",
            required: false,
          })}
          {field("yearly_budget", "Yearly budget (EUR, tuition + living)", {
            type: "number",
            min: 0,
            step: "100",
          })}
        </div>
      </section>
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Preferred countries
        </h2>
        <div className="flex flex-wrap gap-2">
          {countries.map((c) => {
            const on = f.preferred_countries.includes(c);
            return (
              <button
                type="button"
                key={c}
                onClick={() =>
                  setF({
                    ...f,
                    preferred_countries: on
                      ? f.preferred_countries.filter((x) => x !== c)
                      : [...f.preferred_countries, c],
                  })
                }
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition-colors",
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary",
                )}
              >
                {c}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">Leave empty if you're open to any country.</p>
      </section>
      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} className="mt-0.5" />I
        agree that Livio may use these details to recommend universities and help with my
        applications.
      </label>
      <Button type="submit" className="w-full rounded-full sm:w-auto" disabled={busy}>
        {busy ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}

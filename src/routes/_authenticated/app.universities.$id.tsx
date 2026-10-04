import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, CircleAlert, MapPin, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  applicationsQuery,
  eur,
  getUserId,
  matchUniversity,
  profileQuery,
  universitiesQuery,
} from "@/lib/app-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/app/universities/$id")({
  component: UniversityDetailsPage,
});

function UniversityDetailsPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: universities = [], isLoading } = useQuery(universitiesQuery);
  const { data: profile } = useQuery(profileQuery);
  const { data: applications = [] } = useQuery(applicationsQuery);
  const university = universities.find((item) => item.id === id);
  const [program, setProgram] = useState("");
  const [intake, setIntake] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const match = useMemo(
    () => (profile && university ? matchUniversity(profile, university) : null),
    [profile, university],
  );
  const alreadyApplied = applications.some((application) => application.university_id === id);

  async function apply() {
    if (!university || !program.trim() || !intake) {
      toast.error("Choose an intake and enter the programme you want to apply for.");
      return;
    }
    setSubmitting(true);
    try {
      const user_id = await getUserId();
      const { error } = await supabase.from("applications").insert({
        user_id,
        university_id: university.id,
        program: program.trim(),
        intake,
        status: "submitted",
      });
      if (error) throw error;
      await qc.invalidateQueries({ queryKey: ["applications"] });
      toast.success("Application added to My Journey.");
      await navigate({ to: "/app/journey" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start the application.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) return <p className="text-muted-foreground">Loading university…</p>;
  if (!university) {
    return (
      <div className="rounded-[2rem] bg-card p-8 text-center ring-1 ring-border">
        <h1 className="text-2xl font-semibold">University not found</h1>
        <Button asChild className="mt-5 rounded-full">
          <Link to="/app/universities">Back to Explore</Link>
        </Button>
      </div>
    );
  }

  const yearly = Number(university.tuition_eur) + Number(university.living_eur);
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/app/universities"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Explore
      </Link>
      <section className="mt-5 rounded-[2rem] bg-card p-6 ring-1 ring-border sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <MapPin className="h-4 w-4" /> {university.city}, {university.country}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">{university.name}</h1>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              {university.description}
            </p>
          </div>
          {match && (
            <div className="rounded-2xl bg-primary/10 px-5 py-3 text-center text-primary">
              <p className="text-2xl font-semibold">{match.score}%</p>
              <p className="text-xs font-semibold">profile fit</p>
            </div>
          )}
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Tuition / year", eur(university.tuition_eur)],
            ["Living estimate", eur(university.living_eur)],
            ["Estimated total", eur(yearly)],
            ["Teaching language", university.language],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-secondary p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-[2rem] bg-card p-6 ring-1 ring-border">
          <h2 className="text-xl font-semibold">Your fit breakdown</h2>
          {match ? (
            <div className="mt-4 space-y-3">
              {match.reasons.map((reason) => (
                <div key={reason.label} className="flex gap-3 rounded-2xl bg-secondary p-4">
                  {reason.ok ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  ) : (
                    <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  )}
                  <div>
                    <p className="font-semibold">{reason.label}</p>
                    <p className="text-sm text-muted-foreground">{reason.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Complete your profile to calculate a personalised fit score.
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {university.fields.map((field) => (
              <span
                key={field}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
              >
                {field}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-card p-6 ring-1 ring-border">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" /> Start your application
          </p>
          <h2 className="mt-2 text-xl font-semibold">Add this plan to My Journey</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This creates an application workspace. Livio does not submit anything to the university
            without your confirmation.
          </p>
          {alreadyApplied ? (
            <Button asChild className="mt-5 w-full rounded-full">
              <Link to="/app/journey">View in My Journey</Link>
            </Button>
          ) : (
            <div className="mt-5 space-y-3">
              <Input
                value={program}
                onChange={(event) => setProgram(event.target.value)}
                placeholder="Programme name"
                aria-label="Programme name"
                className="h-11 rounded-full"
              />
              <select
                value={intake}
                onChange={(event) => setIntake(event.target.value)}
                aria-label="Preferred intake"
                className="h-11 w-full rounded-full border border-input bg-background px-4 text-sm"
              >
                <option value="">Choose an intake</option>
                {university.intakes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <Button onClick={apply} disabled={submitting} className="w-full rounded-full">
                {submitting ? "Creating application…" : "Start application"}
              </Button>
            </div>
          )}
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Catalogue figures are illustrative. Confirm current fees, eligibility and deadlines with
            the institution or your counsellor.
          </p>
        </section>
      </div>
    </div>
  );
}

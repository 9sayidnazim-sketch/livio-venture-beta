import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, MessageCircle, Search, Sparkles } from "lucide-react";
import {
  applicationsQuery,
  counsellorQuery,
  profileQuery,
  rankUniversities,
  universitiesQuery,
} from "@/lib/app-data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UniversityCard } from "@/components/app/UniversityCard";

export const Route = createFileRoute("/_authenticated/app/")({ component: HomePage });

function HomePage() {
  const { data: profile } = useQuery(profileQuery);
  const { data: universities = [] } = useQuery(universitiesQuery);
  const { data: applications = [] } = useQuery(applicationsQuery);
  const { data: counsellor } = useQuery(counsellorQuery);
  if (!profile) return null;
  const completion = Math.round(
    ([
      profile.full_name,
      profile.subject,
      profile.qualification,
      profile.yearly_budget,
      profile.preferred_countries?.length,
    ].filter(Boolean).length /
      5) *
      100,
  );
  const matches = rankUniversities(profile, universities).slice(0, 3);
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-foreground px-6 py-7 text-background sm:px-8">
        <p className="text-sm text-background/65">
          Good to see you, {profile.full_name.split(" ")[0]}
        </p>
        <div className="mt-3 grid gap-7 md:grid-cols-[1.35fr_.65fr] md:items-end">
          <div>
            <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Turn your study plans into a clear next step.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-background/70">
              Your profile, shortlist, documents and applications stay together—while Livio helps
              you decide what to do next.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link to="/app/advisor">
              <MessageCircle />
              Ask Livio
            </Link>
          </Button>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Link
          to="/app/profile"
          className="rounded-3xl bg-card p-5 ring-1 ring-border transition hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Profile readiness</span>
            <span className="text-sm font-semibold text-primary">{completion}%</span>
          </div>
          <Progress value={completion} className="mt-4" />
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            A complete profile improves the quality of every match.
          </p>
        </Link>
        <Link
          to="/app/universities"
          className="rounded-3xl bg-primary p-5 text-primary-foreground transition hover:-translate-y-0.5"
        >
          <Search className="h-5 w-5" />
          <h2 className="mt-7 text-lg font-semibold">Explore universities</h2>
          <p className="mt-1 text-sm text-primary-foreground/75">
            Filter by subject, country and real yearly cost.
          </p>
        </Link>
        <Link
          to="/app/journey"
          className="rounded-3xl bg-card p-5 ring-1 ring-border transition hover:-translate-y-0.5"
        >
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <h2 className="mt-7 text-lg font-semibold">My journey</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {applications.length
              ? `${applications.length} active application${applications.length === 1 ? "" : "s"}`
              : "Start with a university you trust."}
          </p>
        </Link>
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Based on your profile
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Strong starting points</h2>
          </div>
          <Link
            to="/app/universities"
            className="flex items-center gap-1 text-sm font-semibold text-primary"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {matches.map(({ u, m }) => (
            <UniversityCard key={u.id} university={u} match={m.score} />
          ))}
        </div>
      </section>
      {counsellor && (
        <section className="rounded-3xl bg-card p-6 ring-1 ring-border">
          <p className="text-xs font-semibold text-primary">Your counsellor</p>
          <h2 className="mt-1 text-lg font-semibold">{counsellor.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {counsellor.bio || "Available to review your profile and applications."}
          </p>
        </section>
      )}
    </div>
  );
}

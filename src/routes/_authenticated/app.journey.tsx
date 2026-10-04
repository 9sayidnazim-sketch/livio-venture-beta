import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Circle, FileText } from "lucide-react";
import { applicationsQuery, savedQuery, STATUS_LABEL, STATUS_STEPS } from "@/lib/app-data";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/_authenticated/app/journey")({ component: JourneyPage });
function JourneyPage() {
  const { data: apps = [], isLoading } = useQuery(applicationsQuery);
  const { data: saved = [] } = useQuery(savedQuery);
  return (
    <div>
      <p className="text-sm font-semibold text-primary">My journey</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Everything that moves your plan forward
      </h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl bg-card p-5 ring-1 ring-border">
          <p className="text-3xl font-semibold tabular-nums">{saved.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">Saved universities</p>
        </div>
        <div className="rounded-3xl bg-card p-5 ring-1 ring-border">
          <p className="text-3xl font-semibold tabular-nums">{apps.length}</p>
          <p className="mt-1 text-sm text-muted-foreground">Applications</p>
        </div>
        <Link to="/app/documents" className="rounded-3xl bg-primary p-5 text-primary-foreground">
          <FileText />
          <p className="mt-5 flex items-center justify-between text-sm font-semibold">
            Document centre <ArrowRight className="h-4 w-4" />
          </p>
        </Link>
      </div>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Applications</h2>
        {isLoading ? (
          <p className="mt-4 text-muted-foreground">Loading your journey…</p>
        ) : apps.length === 0 ? (
          <div className="mt-4 rounded-[2rem] bg-card p-8 text-center ring-1 ring-border">
            <h3 className="text-lg font-semibold">No application started yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Explore universities, save the strongest options, and ask Livio before you apply.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <Link to="/app/universities">Explore universities</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {apps.map((a) => {
              const current = STATUS_STEPS.indexOf(a.status);
              const uni = (a.universities as { name?: string } | null)?.name ?? "University";
              return (
                <article key={a.id} className="rounded-[2rem] bg-card p-6 ring-1 ring-border">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-primary">{STATUS_LABEL[a.status]}</p>
                      <h3 className="mt-1 text-lg font-semibold">{uni}</h3>
                      <p className="text-sm text-muted-foreground">
                        {a.program} · {a.intake}
                      </p>
                    </div>
                    <Button asChild variant="outline" className="rounded-full">
                      <Link to="/app/documents">Documents</Link>
                    </Button>
                  </div>
                  <ol className="mt-6 grid grid-cols-4 gap-2">
                    {STATUS_STEPS.map((s, i) => (
                      <li key={s} className="text-center">
                        <span
                          className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full ${i <= current ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                        >
                          {i < current ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Circle className="h-3 w-3" />
                          )}
                        </span>
                        <span className="mt-2 block text-[10px] text-muted-foreground">
                          {STATUS_LABEL[s]}
                        </span>
                      </li>
                    ))}
                  </ol>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

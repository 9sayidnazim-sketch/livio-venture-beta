import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, MapPin, MessageCircle } from "lucide-react";
import logo from "@/assets/livio-venture-logo.png";
import { eur, universitiesQuery } from "@/lib/app-data";
import { PUBLIC_CATALOGUE } from "@/lib/public-catalogue";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/universities/$id")({
  component: PublicUniversityDetailsPage,
});

function PublicUniversityDetailsPage() {
  const { id } = Route.useParams();
  const { data: universities = [], isLoading } = useQuery(universitiesQuery);
  const catalogue = universities.length ? universities : PUBLIC_CATALOGUE;
  const university = catalogue.find((item) => item.id === id);

  if (isLoading)
    return (
      <div className="min-h-screen bg-secondary p-10 text-muted-foreground">
        Loading university…
      </div>
    );
  if (!university) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary p-5">
        <div className="rounded-3xl bg-card p-8 text-center ring-1 ring-border">
          <h1 className="text-2xl font-semibold">University not found</h1>
          <Button asChild className="mt-5 rounded-full">
            <Link to="/universities">Return to catalogue</Link>
          </Button>
        </div>
      </div>
    );
  }
  const yearly = Number(university.tuition_eur) + Number(university.living_eur);

  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/">
            <img src={logo} alt="Livio Venture" className="h-9 w-auto" />
          </Link>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/auth" search={{ next: "/app/advisor" }}>
              <MessageCircle className="h-4 w-4" /> Ask Livio AI
            </Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">
        <Link
          to="/universities"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> All universities
        </Link>
        <section className="mt-6 rounded-[2rem] bg-card p-6 ring-1 ring-border sm:p-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <MapPin className="h-4 w-4" /> {university.city}, {university.country}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {university.name}
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{university.description}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Tuition / year", eur(university.tuition_eur)],
              ["Living estimate", eur(university.living_eur)],
              ["Estimated total", eur(yearly)],
              ["Language", university.language],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-secondary p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_.8fr]">
          <section className="rounded-[2rem] bg-card p-6 ring-1 ring-border">
            <h2 className="text-xl font-semibold">Available study areas</h2>
            <div className="mt-4 space-y-3">
              {university.fields.map((field) => (
                <div key={field} className="flex items-center gap-3 rounded-2xl bg-secondary p-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="font-medium">{field}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-muted-foreground">
              Programme availability, fees and requirements are illustrative until verified with the
              university.
            </p>
          </section>
          <section className="rounded-[2rem] bg-primary p-6 text-primary-foreground">
            <p className="text-sm font-semibold opacity-80">Ready to continue?</p>
            <h2 className="mt-2 text-2xl font-semibold">Select a course and start your journey</h2>
            <p className="mt-3 text-sm leading-6 opacity-80">
              Create an account only when you are ready to save your profile, use AI guidance or
              begin an application.
            </p>
            <Button asChild variant="secondary" className="mt-6 w-full rounded-full">
              <Link to="/auth" search={{ next: "/app/universities" }}>
                Select course & continue
              </Link>
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}

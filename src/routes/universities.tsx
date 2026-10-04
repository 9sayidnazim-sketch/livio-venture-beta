import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, MessageCircle, Search } from "lucide-react";
import logo from "@/assets/livio-venture-logo.png";
import { eur, universitiesQuery } from "@/lib/app-data";
import { PUBLIC_CATALOGUE } from "@/lib/public-catalogue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/universities")({
  head: () => ({ meta: [{ title: "Explore universities — Livio Venture" }] }),
  component: PublicUniversitiesPage,
});

function PublicUniversitiesPage() {
  const matchRoute = useMatchRoute();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All");
  const { data: universities = [], isLoading, isError } = useQuery(universitiesQuery);
  const catalogue = universities.length ? universities : PUBLIC_CATALOGUE;
  const countries = ["All", ...Array.from(new Set(catalogue.map((item) => item.country))).sort()];
  const results = useMemo(
    () =>
      catalogue.filter(
        (item) =>
          (country === "All" || item.country === country) &&
          `${item.name} ${item.city} ${item.fields.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [catalogue, country, query],
  );

  if (matchRoute({ to: "/universities/$id", fuzzy: true })) return <Outlet />;

  return (
    <div className="min-h-screen bg-secondary">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <Link to="/">
            <img src={logo} alt="Livio Venture" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/auth" search={{ next: "/app/advisor" }}>
                <MessageCircle className="h-4 w-4" /> Ask Livio AI
              </Link>
            </Button>
            <Button asChild className="hidden rounded-full sm:inline-flex">
              <Link to="/auth" search={{ next: "/app" }}>
                Sign in
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 lg:px-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <p className="mt-8 text-sm font-semibold text-primary">Explore freely</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Find your university before creating an account
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Browse destinations, fields and estimated costs. Sign-in is only requested when you use
          Livio AI or begin an application.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search university, city or subject"
              className="h-11 rounded-full pl-11"
            />
          </label>
          <select
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            aria-label="Country"
            className="h-11 rounded-full border border-input bg-card px-4 text-sm"
          >
            {countries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <p className="mt-8 text-muted-foreground">Loading universities…</p>
        ) : isError && !PUBLIC_CATALOGUE.length ? (
          <div className="mt-8 rounded-3xl bg-card p-6 ring-1 ring-border">
            <h2 className="font-semibold">The university catalogue is being connected</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You can still explore the website or contact Livio for guidance.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((university) => (
              <article
                key={university.id}
                className="flex flex-col rounded-[1.75rem] bg-card p-5 ring-1 ring-border"
              >
                <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <MapPin className="h-3.5 w-3.5" />
                  {university.city}, {university.country}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{university.name}</h2>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {university.description}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-secondary p-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Yearly estimate</p>
                    <p className="mt-1 font-semibold">
                      {eur(Number(university.tuition_eur) + Number(university.living_eur))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Intakes</p>
                    <p className="mt-1 font-semibold">
                      {university.intakes.slice(0, 2).join(", ")}
                    </p>
                  </div>
                </div>
                <Button asChild className="mt-5 rounded-full">
                  <Link to="/universities/$id" params={{ id: university.id }}>
                    View courses & details
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

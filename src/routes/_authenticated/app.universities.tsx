import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  getUserId,
  profileQuery,
  rankUniversities,
  savedQuery,
  universitiesQuery,
} from "@/lib/app-data";
import { Input } from "@/components/ui/input";
import { UniversityCard } from "@/components/app/UniversityCard";

export const Route = createFileRoute("/_authenticated/app/universities")({
  component: UniversitiesPage,
});
function UniversitiesPage() {
  const matchRoute = useMatchRoute();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All");
  const { data: profile } = useQuery(profileQuery);
  const { data: unis = [] } = useQuery(universitiesQuery);
  const { data: saved = [] } = useQuery(savedQuery);
  const countries = ["All", ...Array.from(new Set(unis.map((u) => u.country))).sort()];
  const results = useMemo(() => {
    const ranked = profile
      ? rankUniversities(profile, unis)
      : unis.map((u) => ({ u, m: { score: undefined } }));
    return ranked.filter(
      ({ u }) =>
        (country === "All" || u.country === country) &&
        `${u.name} ${u.city} ${u.fields.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
    );
  }, [profile, unis, country, query]);
  if (matchRoute({ to: "/app/universities/$id", fuzzy: true })) return <Outlet />;
  async function toggle(id: string) {
    try {
      const user_id = await getUserId();
      if (saved.includes(id)) {
        const { error } = await supabase
          .from("saved_universities")
          .delete()
          .eq("user_id", user_id)
          .eq("university_id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("saved_universities")
          .insert({ user_id, university_id: id });
        if (error) throw error;
      }
      await qc.invalidateQueries({ queryKey: ["saved"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update shortlist");
    }
  }
  return (
    <div>
      <p className="text-sm font-semibold text-primary">Explore</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Find universities that fit your plans
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Search the illustrative catalogue, then confirm fees and entry requirements with your
        counsellor.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search university, city or subject"
            className="h-11 rounded-full pl-11"
          />
        </label>
        <select
          aria-label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="h-11 rounded-full border border-input bg-card px-4 text-sm"
        >
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">{results.length} universities</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {results.map(({ u, m }) => (
          <UniversityCard
            key={u.id}
            university={u}
            {...(m.score == null ? {} : { match: m.score })}
            saved={saved.includes(u.id)}
            onSave={() => toggle(u.id)}
          />
        ))}
      </div>
    </div>
  );
}

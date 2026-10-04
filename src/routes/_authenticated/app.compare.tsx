import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { savedQuery, universitiesQuery, eur, type University } from "@/lib/app-data";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/_authenticated/app/compare")({ component: ComparePage });
function ComparePage() {
  const { data: saved = [] } = useQuery(savedQuery);
  const { data: unis = [] } = useQuery(universitiesQuery);
  const chosen = unis.filter((u) => saved.includes(u.id)).slice(0, 3);
  const rows: Array<[string, (university: University) => string]> = [
    ["Location", (u) => `${u.city}, ${u.country}`],
    ["Yearly estimate", (u) => eur(Number(u.tuition_eur) + Number(u.living_eur))],
    ["Typical minimum", (u) => `${u.min_score}%`],
    ["English", (u) => `IELTS ${u.min_ielts}`],
    ["Intakes", (u) => u.intakes.join(", ")],
  ];
  return (
    <div>
      <p className="text-sm font-semibold text-primary">Compare</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your shortlist, side by side</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Showing up to three saved universities. All catalogue figures remain illustrative.
      </p>
      {chosen.length < 2 ? (
        <div className="mt-6 rounded-[2rem] bg-card p-8 text-center ring-1 ring-border">
          <h2 className="text-lg font-semibold">Save at least two universities</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use Explore to build a shortlist before comparing.
          </p>
          <Button asChild className="mt-5 rounded-full">
            <Link to="/app/universities">Explore universities</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[2rem] bg-card ring-1 ring-border">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr>
                {chosen.map((u) => (
                  <th key={u.id} className="p-5 text-lg">
                    {u.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, value]) => (
                <tr key={label} className="border-t border-border">
                  <th className="sr-only">{label}</th>
                  {chosen.map((u) => (
                    <td key={u.id} className="p-5">
                      <span className="block text-xs text-muted-foreground">{label}</span>
                      <strong className="mt-1 block">{value(u)}</strong>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

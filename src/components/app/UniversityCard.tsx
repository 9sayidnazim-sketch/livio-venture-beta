import { Link } from "@tanstack/react-router";
import { Bookmark, MapPin, Scale, Sparkles } from "lucide-react";
import type { University } from "@/lib/app-data";
import { eur } from "@/lib/app-data";
import { Button } from "@/components/ui/button";

export function UniversityCard({
  university,
  match,
  saved = false,
  onSave,
}: {
  university: University;
  match?: number;
  saved?: boolean;
  onSave?: () => void;
}) {
  const yearly = Number(university.tuition_eur) + Number(university.living_eur);
  return (
    <article className="flex h-full flex-col rounded-[1.75rem] bg-card p-5 shadow-[0_18px_50px_-32px_rgba(15,65,95,.35)] ring-1 ring-border/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-30px_rgba(15,65,95,.42)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
            <MapPin className="h-3.5 w-3.5" />
            {university.city}, {university.country}
          </p>
          <h3 className="mt-2 text-lg font-semibold leading-tight text-foreground">
            {university.name}
          </h3>
        </div>
        {match != null && (
          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
            {match}% fit
          </span>
        )}
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
        {university.description}
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-secondary p-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Estimated yearly cost</dt>
          <dd className="mt-1 font-semibold tabular-nums">{eur(yearly)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Intakes</dt>
          <dd className="mt-1 font-semibold">{university.intakes.slice(0, 2).join(", ")}</dd>
        </div>
      </dl>
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
        Illustrative catalogue data. Confirm requirements before applying.
      </p>
      <div className="mt-auto flex gap-2 pt-5">
        <Button asChild className="flex-1 rounded-full">
          <Link to="/app/universities/$id" params={{ id: university.id }}>
            View details
          </Link>
        </Button>
        {onSave && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={onSave}
            aria-label={saved ? "Remove saved university" : "Save university"}
          >
            <Bookmark className={saved ? "fill-primary text-primary" : ""} />
          </Button>
        )}
        <Button
          asChild
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Compare saved universities"
        >
          <Link to="/app/compare">
            <Scale />
          </Link>
        </Button>
      </div>
    </article>
  );
}

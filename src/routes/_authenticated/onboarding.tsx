import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import logo from "@/assets/livio-venture-logo.png";
import { ProfileForm } from "@/components/app/ProfileForm";
import { profileQuery } from "@/lib/app-data";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [{ title: "Set up your profile — Livio" }, { name: "robots", content: "noindex" }],
  }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const { user } = Route.useRouteContext();
  const { data, isLoading } = useQuery(profileQuery);
  return (
    <div className="min-h-screen bg-secondary px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <img src={logo} alt="Livio Venture" className="h-9 w-auto" />
        <h1 className="mt-8 text-3xl font-bold text-foreground">Tell us about yourself</h1>
        <p className="mt-2 text-muted-foreground">
          This takes about two minutes and lets us recommend universities that fit you.
        </p>
        <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-8">
          {isLoading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
            <ProfileForm
              initial={data ?? null}
              {...(user.email ? { defaultEmail: user.email } : {})}
              submitLabel="Continue"
              onSaved={() => navigate({ to: "/app" })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

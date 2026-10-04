import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProfileForm } from "@/components/app/ProfileForm";
import { profileQuery } from "@/lib/app-data";
export const Route = createFileRoute("/_authenticated/app/profile")({ component: ProfilePage });
function ProfilePage() {
  const { data: p } = useQuery(profileQuery);
  return (
    <div>
      <p className="text-sm font-semibold text-primary">Profile</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">
        Keep your recommendations accurate
      </h1>
      <div className="mt-6 rounded-[2rem] bg-card p-6 ring-1 ring-border">
        <ProfileForm initial={p ?? null} />
      </div>
    </div>
  );
}

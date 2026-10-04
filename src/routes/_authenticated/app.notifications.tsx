import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { notificationsQuery } from "@/lib/app-data";
export const Route = createFileRoute("/_authenticated/app/notifications")({
  component: NotificationsPage,
});
function NotificationsPage() {
  const { data: items = [] } = useQuery(notificationsQuery);
  return (
    <div>
      <p className="text-sm font-semibold text-primary">Updates</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Notifications</h1>
      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[2rem] bg-card p-8 text-center ring-1 ring-border">
            <Bell className="mx-auto text-primary" />
            <h2 className="mt-4 font-semibold">You are up to date</h2>
          </div>
        ) : (
          items.map((n) => (
            <Link
              key={n.id}
              to={(n.link || "/app") as "/app"}
              className="block rounded-3xl bg-card p-5 ring-1 ring-border"
            >
              <p className="font-semibold">{n.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

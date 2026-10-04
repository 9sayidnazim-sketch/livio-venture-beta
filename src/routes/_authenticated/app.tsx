import { createFileRoute, Link, Navigate, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Compass,
  FileText,
  GraduationCap,
  Home,
  MessageCircle,
  Route as RouteIcon,
  Settings,
  User,
  Scale,
} from "lucide-react";
import logo from "@/assets/livio-venture-logo.png";
import { notificationsQuery, profileQuery } from "@/lib/app-data";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [{ title: "Livio — Your study-abroad app" }, { name: "robots", content: "noindex" }],
  }),
  component: AppLayout,
});

const NAV = [
  { to: "/app", label: "Home", icon: Home, exact: true },
  { to: "/app/universities", label: "Universities", icon: GraduationCap },
  { to: "/app/advisor", label: "Advisor", icon: MessageCircle },
  { to: "/app/journey", label: "Journey", icon: RouteIcon },
  { to: "/app/compare", label: "Compare", icon: Scale },
  { to: "/app/documents", label: "Documents", icon: FileText },
  { to: "/app/profile", label: "Profile", icon: User },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;
const MOBILE = ["/app", "/app/advisor", "/app/journey"];

function AppLayout() {
  const { data: profile, isLoading } = useQuery(profileQuery);
  const { data: notes = [] } = useQuery(notificationsQuery);
  const unread = notes.filter((n) => !n.read_at).length;

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  if (!profile) return <Navigate to="/onboarding" replace />;

  return (
    <div className="min-h-screen bg-secondary">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-card p-5 lg:flex">
        <Link to="/app">
          <img src={logo} alt="Livio Venture" className="h-9 w-auto" />
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, ...rest }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: "exact" in rest }}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-primary" }}
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/90 px-5 py-3 backdrop-blur lg:ml-60 lg:px-8">
        <Link to="/app" className="lg:hidden">
          <img src={logo} alt="Livio Venture" className="h-7 w-auto" />
        </Link>
        <p className="hidden text-sm text-muted-foreground lg:block">
          Hi {profile.full_name.split(" ")[0]} 👋
        </p>
        <div className="flex items-center gap-2">
          <Link
            to="/app/compare"
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary lg:hidden"
            aria-label="Compare"
          >
            <Scale className="h-5 w-5" />
          </Link>
          <Link
            to="/app/notifications"
            className="relative rounded-full p-2 text-muted-foreground hover:bg-secondary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-primary-foreground">
                {unread}
              </span>
            )}
          </Link>
          <Link
            to="/app/settings"
            className="rounded-full p-2 text-muted-foreground hover:bg-secondary lg:hidden"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="px-4 pb-28 pt-5 sm:px-6 lg:ml-60 lg:px-8 lg:pb-10">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {NAV.filter((n) => MOBILE.includes(n.to)).map(({ to, label, icon: Icon, ...rest }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: "exact" in rest }}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
            activeProps={{ className: "text-primary" }}
          >
            <Icon className="h-5 w-5" /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export { Compass };

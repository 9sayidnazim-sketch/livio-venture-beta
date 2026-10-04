import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/_authenticated/app/settings")({ component: SettingsPage });
function SettingsPage() {
  const navigate = useNavigate();
  return (
    <div>
      <p className="text-sm font-semibold text-primary">Account</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">Settings</h1>
      <div className="mt-6 rounded-[2rem] bg-card p-6 ring-1 ring-border">
        <h2 className="font-semibold">Session</h2>
        <p className="mt-1 text-sm text-muted-foreground">Sign out of Livio on this device.</p>
        <Button
          variant="outline"
          className="mt-5 rounded-full"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth" });
          }}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}

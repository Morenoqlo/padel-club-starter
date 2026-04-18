import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ── Dev bypass ──────────────────────────────────────────────
  // Set DEV_BYPASS_ADMIN_AUTH=true in .env.local to skip auth
  // during local development. Never set this in production.
  const isBypass =
    process.env.DEV_BYPASS_ADMIN_AUTH === "true" &&
    process.env.NODE_ENV !== "production";

  if (!isBypass) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }
  }

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <AdminSidebar devMode={isBypass} />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-5xl py-8">{children}</div>
      </main>
    </div>
  );
}

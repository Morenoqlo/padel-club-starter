import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTimeout } from "@/components/admin/admin-timeout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isBypass = process.env.DEV_BYPASS_ADMIN_AUTH === "true";

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <AdminSidebar devMode={isBypass} />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-5xl py-8 pt-16 md:pt-8">{children}</div>
      </main>
      {/* Auto-logout: 3 min inactividad + cierre de pestaña */}
      {!isBypass && <AdminTimeout />}
    </div>
  );
}

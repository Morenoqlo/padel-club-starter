"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Image,
  Calendar,
  Users,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
  FlaskConical,
  ShoppingCart,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { brandConfig } from "@/config/brand";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",    href: "/admin",                icon: LayoutDashboard, exact: true },
  { label: "Órdenes",      href: "/admin/ordenes",        icon: ShoppingCart },
  { label: "Productos",    href: "/admin/productos",      icon: ShoppingBag },
  { label: "Galería",      href: "/admin/galeria",        icon: Image },
  { label: "Eventos",      href: "/admin/eventos",        icon: Calendar },
  { label: "Clases",       href: "/admin/clases",         icon: Users },
  { label: "Testimonios",  href: "/admin/testimonios",    icon: Star },
  { label: "FAQ",          href: "/admin/faq",            icon: HelpCircle },
  { label: "Configuración",href: "/admin/configuracion",  icon: Settings },
];

interface AdminSidebarProps {
  devMode?: boolean;
}

export function AdminSidebar({ devMode = false }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <aside className="sticky top-0 h-screen w-60 shrink-0 border-r border-border bg-background flex flex-col">
      {/* Logo */}
      <div className="border-b border-border px-5 py-4">
        <Link href="/" className="flex items-center gap-2 font-display font-bold">
          <span className="text-accent">{brandConfig.sport.icon}</span>
          <span className="text-sm">{brandConfig.shortName}</span>
          <span className="text-xs text-muted-foreground">Admin</span>
        </Link>
      </div>

      {/* Dev mode badge */}
      {devMode && (
        <div className="mx-3 mt-3 flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2">
          <FlaskConical className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-600 font-medium">Modo desarrollo</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-3 py-3 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          Ver sitio web
        </Link>
        {!devMode && (
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        )}
      </div>
    </aside>
  );
}

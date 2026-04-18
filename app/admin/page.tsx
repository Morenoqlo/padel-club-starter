import {
  ShoppingBag,
  Image,
  Calendar,
  Users,
  HelpCircle,
  TrendingUp,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

// Attempt to load real data; fall back gracefully
async function getDashboardStats() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const [
      { count: productsCount },
      { count: ordersCount },
      { count: eventsCount },
      { count: classesCount },
    ] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("classes").select("*", { count: "exact", head: true }).eq("is_active", true),
    ]);
    return { productsCount, ordersCount, eventsCount, classesCount };
  } catch {
    // Dev mode: return mock counts
    return { productsCount: 4, ordersCount: 12, eventsCount: 3, classesCount: 3 };
  }
}

export default async function AdminDashboardPage() {
  const { productsCount, ordersCount, eventsCount, classesCount } =
    await getDashboardStats();

  const stats = [
    {
      label: "Productos activos",
      value: productsCount ?? 0,
      icon: ShoppingBag,
      href: "/admin/productos",
      trend: "+2 este mes",
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Órdenes totales",
      value: ordersCount ?? 0,
      icon: TrendingUp,
      href: "/admin/ordenes",
      trend: "+5 esta semana",
      color: "text-accent bg-accent/10",
    },
    {
      label: "Eventos activos",
      value: eventsCount ?? 0,
      icon: Calendar,
      href: "/admin/eventos",
      trend: "2 próximos",
      color: "text-purple-500 bg-purple-500/10",
    },
    {
      label: "Clases activas",
      value: classesCount ?? 0,
      icon: Users,
      href: "/admin/clases",
      trend: "Cupos disponibles",
      color: "text-amber-500 bg-amber-500/10",
    },
  ];

  const quickActions = [
    { label: "Gestionar productos", href: "/admin/productos", icon: ShoppingBag, desc: "Ver, agregar y editar productos de la tienda" },
    { label: "Gestionar galería", href: "/admin/galeria", icon: Image, desc: "Subir y organizar fotos del club" },
    { label: "Gestionar eventos", href: "/admin/eventos", icon: Calendar, desc: "Publicar torneos y eventos sociales" },
    { label: "Gestionar clases", href: "/admin/clases", icon: Users, desc: "Administrar la academia y horarios" },
    { label: "Gestionar FAQ", href: "/admin/faq", icon: HelpCircle, desc: "Editar preguntas frecuentes" },
    { label: "Configuración", href: "/admin/configuracion", icon: Activity, desc: "Ajustes generales del sitio" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Panel de administración — Vista general del club.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-xl bg-background border border-border p-5 hover:border-accent/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="font-display text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-accent mt-1">{stat.trend}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="rounded-xl bg-background border border-border p-6">
        <h2 className="font-display text-lg font-semibold mb-5">Acciones rápidas</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-4 rounded-xl border border-border p-4 hover:bg-secondary/50 hover:border-accent/20 transition-all group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

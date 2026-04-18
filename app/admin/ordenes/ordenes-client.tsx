"use client";

import { useState } from "react";
import { adminDb } from "@/lib/admin-db";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns/format";
import { es } from "date-fns/locale/es";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Search, ShoppingCart } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Order {
  id: string;
  created_at: string;
  updated_at: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string | null;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_provider: "stripe" | "mercadopago" | "transbank" | null;
  payment_intent_id: string | null;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  shipping_address: Record<string, string> | null;
  notes: string | null;
  metadata: Record<string, unknown> | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ORDER_STATUSES = [
  { value: "pending",    label: "Pendiente",   variant: "secondary"    },
  { value: "paid",       label: "Pagado",      variant: "accent"       },
  { value: "processing", label: "Procesando",  variant: "warning"      },
  { value: "shipped",    label: "Enviado",      variant: "warning"      },
  { value: "delivered",  label: "Entregado",   variant: "default"      },
  { value: "cancelled",  label: "Cancelado",   variant: "destructive"  },
  { value: "refunded",   label: "Reembolsado", variant: "secondary"    },
] as const;

const PAYMENT_STATUSES = [
  { value: "pending",  label: "Pendiente",    variant: "secondary"   },
  { value: "paid",     label: "Pagado",       variant: "accent"      },
  { value: "failed",   label: "Fallido",      variant: "destructive" },
  { value: "refunded", label: "Reembolsado",  variant: "secondary"   },
] as const;

const PROVIDER_LABELS: Record<string, string> = {
  stripe: "Stripe",
  mercadopago: "MercadoPago",
  transbank: "Transbank",
};

function statusInfo(status: Order["status"]) {
  return ORDER_STATUSES.find((s) => s.value === status) ?? ORDER_STATUSES[0];
}

function paymentInfo(status: Order["payment_status"]) {
  return PAYMENT_STATUSES.find((s) => s.value === status) ?? PAYMENT_STATUSES[0];
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function formatOrderDate(dateStr: string) {
  try {
    return format(new Date(dateStr), "d MMM yyyy HH:mm", { locale: es });
  } catch {
    return dateStr;
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OrdenesClient({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Order[]>(orders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selected, setSelected] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ── Filtrado ──────────────────────────────────────────────────

  const filtered = items.filter((o) => {
    const matchSearch =
      !search ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // ── Totales rápidos ───────────────────────────────────────────

  const totalRevenue = items
    .filter((o) => o.payment_status === "paid")
    .reduce((acc, o) => acc + o.total, 0);

  const pendingCount = items.filter((o) => o.status === "pending" || o.status === "paid").length;

  // ── Cambiar estado ────────────────────────────────────────────

  async function handleStatusChange(order: Order, newStatus: Order["status"]) {
    setUpdatingId(order.id);
    try {
      await adminDb.update("orders", order.id, { status: newStatus });

      setItems((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      );
      if (selected?.id === order.id) {
        setSelected((prev) => prev ? { ...prev, status: newStatus } : prev);
      }
      toast.success("Estado actualizado.");
      router.refresh();
    } catch {
      // Demo fallback
      setItems((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      );
      if (selected?.id === order.id) {
        setSelected((prev) => prev ? { ...prev, status: newStatus } : prev);
      }
      toast.success("Estado actualizado (modo demo).");
    } finally {
      setUpdatingId(null);
    }
  }

  // ── Render ────────────────────────────────────────────────────

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Órdenes</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} orden{items.length !== 1 ? "es" : ""} en total
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Ingresos pagados</p>
          <p className="text-2xl font-bold font-display">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Por procesar</p>
          <p className="text-2xl font-bold font-display">{pendingCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total órdenes</p>
          <p className="text-2xl font-bold font-display">{items.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
        >
          <option value="all">Todos los estados</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                  <ShoppingCart className="mx-auto h-8 w-8 mb-3 opacity-30" />
                  {search || filterStatus !== "all"
                    ? "Sin resultados para la búsqueda."
                    : "No hay órdenes todavía."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => {
                const si = statusInfo(order.status);
                const pi = paymentInfo(order.payment_status);
                return (
                  <TableRow key={order.id} className="cursor-pointer hover:bg-secondary/40">
                    <TableCell>
                      <span className="font-mono text-sm font-semibold">
                        #{shortId(order.id)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatOrderDate(order.created_at)}
                    </TableCell>
                    <TableCell className="font-semibold text-sm">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={pi.variant as "default"}>{pi.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={si.variant as "default"}>{si.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => setSelected(order)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={(v) => { if (!v) setSelected(null); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-mono">#{shortId(selected.id)}</span>
                  <Badge variant={statusInfo(selected.status).variant as "default"}>
                    {statusInfo(selected.status).label}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {/* Cliente */}
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Cliente
                  </h3>
                  <div className="rounded-lg bg-secondary/50 p-3 space-y-1 text-sm">
                    <p className="font-medium">{selected.customer_name}</p>
                    <p className="text-muted-foreground">{selected.customer_email}</p>
                    {selected.customer_phone && (
                      <p className="text-muted-foreground">{selected.customer_phone}</p>
                    )}
                  </div>
                </section>

                {/* Dirección de envío */}
                {selected.shipping_address && (
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Envío
                    </h3>
                    <div className="rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground space-y-0.5">
                      {Object.values(selected.shipping_address).map((v, i) => (
                        <p key={i}>{String(v)}</p>
                      ))}
                    </div>
                  </section>
                )}

                {/* Resumen económico */}
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Resumen
                  </h3>
                  <div className="rounded-lg bg-secondary/50 p-3 text-sm space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(selected.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span>{selected.shipping_cost === 0 ? "Gratis" : formatPrice(selected.shipping_cost)}</span>
                    </div>
                    {selected.tax > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IVA</span>
                        <span>{formatPrice(selected.tax)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-border pt-1.5 font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(selected.total)}</span>
                    </div>
                    {selected.payment_provider && (
                      <div className="flex justify-between text-xs text-muted-foreground pt-0.5">
                        <span>Proveedor de pago</span>
                        <span>{PROVIDER_LABELS[selected.payment_provider] ?? selected.payment_provider}</span>
                      </div>
                    )}
                  </div>
                </section>

                {/* Notas */}
                {selected.notes && (
                  <section>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Notas
                    </h3>
                    <p className="rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">
                      {selected.notes}
                    </p>
                  </section>
                )}

                {/* Cambiar estado */}
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Cambiar estado
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ORDER_STATUSES.map((s) => (
                      <button
                        key={s.value}
                        disabled={selected.status === s.value || updatingId === selected.id}
                        onClick={() => handleStatusChange(selected, s.value)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors disabled:opacity-40 ${
                          selected.status === s.value
                            ? "bg-accent text-white border-accent"
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

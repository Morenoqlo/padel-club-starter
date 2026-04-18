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
  DialogFooter,
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
import { Pencil, Trash2, Plus, Users, MapPin } from "lucide-react";

const F =
  "w-full rounded-xl border border-border px-3 py-2 text-sm bg-background outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string;
  event_end_date: string | null;
  location: string | null;
  category: string | null;
  price: number | null;
  max_participants: number | null;
  current_participants: number | null;
  is_active: boolean;
  is_featured: boolean;
  image_url: string | null;
}

type FormState = {
  title: string;
  description: string;
  event_date: string;
  event_end_date: string;
  location: string;
  category: string;
  price: string;
  max_participants: string;
  is_active: boolean;
  is_featured: boolean;
};

const defaultForm: FormState = {
  title: "",
  description: "",
  event_date: "",
  event_end_date: "",
  location: "",
  category: "",
  price: "",
  max_participants: "",
  is_active: true,
  is_featured: false,
};

function eventToForm(e: Event): FormState {
  return {
    title: e.title,
    description: e.description ?? "",
    event_date: e.event_date ? e.event_date.slice(0, 16) : "",
    event_end_date: e.event_end_date ? e.event_end_date.slice(0, 16) : "",
    location: e.location ?? "",
    category: e.category ?? "",
    price: e.price != null ? String(e.price) : "",
    max_participants: e.max_participants != null ? String(e.max_participants) : "",
    is_active: e.is_active,
    is_featured: e.is_featured,
  };
}

function categoryBadge(category: string | null) {
  switch (category) {
    case "tournament":
      return <Badge variant="destructive">Torneo</Badge>;
    case "clinic":
      return <Badge variant="accent">Clínica</Badge>;
    case "social":
      return <Badge variant="warning">Social</Badge>;
    default:
      return <Badge variant="secondary">{category ?? "—"}</Badge>;
  }
}

function formatEventDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "d MMM yyyy", { locale: es });
  } catch {
    return dateStr;
  }
}

export function EventosClient({ events }: { events: Event[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Event[]>(events);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(event: Event) {
    setEditing(event);
    setForm(eventToForm(event));
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
    setForm(defaultForm);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.title.trim() || !form.event_date) {
      toast.error("Título y fecha de inicio son obligatorios.");
      return;
    }
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      event_date: form.event_date,
      event_end_date: form.event_end_date || null,
      location: form.location || null,
      category: form.category || null,
      price: form.price !== "" ? Number(form.price) : null,
      max_participants: form.max_participants !== "" ? Number(form.max_participants) : null,
      is_active: form.is_active,
      is_featured: form.is_featured,
    };

    try {
      if (editing) {
        await adminDb.update("events", editing.id, payload);
        setItems((prev) =>
          prev.map((ev) => (ev.id === editing.id ? { ...ev, ...payload } : ev))
        );
        toast.success("Evento actualizado.");
      } else {
        const slug = form.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        const data = await adminDb.insert<Event>("events", {
          ...payload, slug, current_participants: 0, image_url: null,
        });
        setItems((prev) => [data, ...prev]);
        toast.success("Evento creado.");
      }
      router.refresh();
      handleClose();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(event: Event) {
    if (!confirm(`¿Eliminar "${event.title}"?`)) return;
    try {
      await adminDb.delete("events", event.id);
      setItems((prev) => prev.filter((ev) => ev.id !== event.id));
      toast.success("Evento eliminado.");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al eliminar. Intenta de nuevo.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Eventos</h1>
          <p className="text-sm text-muted-foreground">{items.length} evento{items.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Participantes</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay eventos registrados.
                </TableCell>
              </TableRow>
            ) : (
              items.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div className="font-medium">{event.title}</div>
                    {event.location && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{categoryBadge(event.category)}</TableCell>
                  <TableCell className="text-sm">{formatEventDate(event.event_date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      {event.current_participants ?? 0}
                      {event.max_participants != null && `/${event.max_participants}`}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {event.price != null ? formatPrice(event.price) : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {event.is_active && <Badge variant="default">Activo</Badge>}
                      {event.is_featured && <Badge variant="secondary">Destacado</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(event)}
                        className="rounded-lg p-1.5 hover:bg-muted transition-colors"
                        aria-label="Editar evento"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        className="rounded-lg p-1.5 hover:bg-destructive/10 text-destructive transition-colors"
                        aria-label="Eliminar evento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar evento" : "Nuevo evento"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Título */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Título <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                className={F}
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="Nombre del evento"
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Descripción</label>
              <textarea
                className={F}
                rows={3}
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Descripción del evento"
              />
            </div>

            {/* Fecha inicio */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Fecha inicio <span className="text-destructive">*</span>
              </label>
              <input
                type="datetime-local"
                className={F}
                value={form.event_date}
                onChange={(e) => setField("event_date", e.target.value)}
              />
            </div>

            {/* Fecha fin */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Fecha fin</label>
              <input
                type="datetime-local"
                className={F}
                value={form.event_end_date}
                onChange={(e) => setField("event_end_date", e.target.value)}
              />
            </div>

            {/* Lugar */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Lugar</label>
              <input
                type="text"
                className={F}
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                placeholder="Ubicación del evento"
              />
            </div>

            {/* Categoría */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Categoría</label>
              <select
                className={F}
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
              >
                <option value="">Sin categoría</option>
                <option value="tournament">Torneo</option>
                <option value="clinic">Clínica</option>
                <option value="social">Social</option>
              </select>
            </div>

            {/* Precio */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Precio</label>
              <input
                type="number"
                className={F}
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Máx. participantes */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Máx. participantes</label>
              <input
                type="number"
                className={F}
                value={form.max_participants}
                onChange={(e) => setField("max_participants", e.target.value)}
                placeholder="Sin límite"
                min="1"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setField("is_active", e.target.checked)}
                  className="rounded"
                />
                Activo
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setField("is_featured", e.target.checked)}
                  className="rounded"
                />
                Destacado
              </label>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={handleClose}
              className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

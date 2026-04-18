"use client";

import { useState } from "react";
import { adminDb } from "@/lib/admin-db";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import { Pencil, Trash2, Plus, Star } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Testimonial {
  id: string;
  created_at: string;
  author_name: string;
  author_role: string | null;
  author_image: string | null;
  content: string;
  rating: number;
  is_active: boolean;
  sort_order: number;
}

type FormState = {
  author_name: string;
  author_role: string;
  content: string;
  rating: string;
  sort_order: string;
  is_active: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const F =
  "w-full rounded-xl border border-border px-3 py-2 text-sm bg-background outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

const defaultForm: FormState = {
  author_name: "",
  author_role: "",
  content: "",
  rating: "5",
  sort_order: "",
  is_active: true,
};

function testimonialToForm(t: Testimonial): FormState {
  return {
    author_name: t.author_name,
    author_role: t.author_role ?? "",
    content: t.content,
    rating: String(t.rating),
    sort_order: String(t.sort_order),
    is_active: t.is_active,
  };
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TestimoniosClient({ testimonials }: { testimonials: Testimonial[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Testimonial[]>(testimonials);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);

  // ── Modal helpers ─────────────────────────────────────────────

  function openNew() {
    setEditing(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm(testimonialToForm(t));
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

  // ── Save ─────────────────────────────────────────────────────

  async function handleSave() {
    if (!form.author_name.trim()) {
      toast.error("El nombre del autor es obligatorio.");
      return;
    }
    if (!form.content.trim()) {
      toast.error("El contenido es obligatorio.");
      return;
    }
    setSaving(true);

    const payload = {
      author_name: form.author_name.trim(),
      author_role: form.author_role.trim() || null,
      content: form.content.trim(),
      rating: Math.min(5, Math.max(1, Number(form.rating) || 5)),
      sort_order: form.sort_order !== "" ? Number(form.sort_order) : 0,
      is_active: form.is_active,
    };

    try {
      if (editing) {
        await adminDb.update("testimonials", editing.id, payload);
        setItems((prev) =>
          prev.map((t) => (t.id === editing.id ? { ...t, ...payload } : t))
        );
        toast.success("Testimonio actualizado.");
      } else {
        const data = await adminDb.insert<Testimonial>("testimonials", {
          ...payload, author_image: null,
        });
        setItems((prev) => [data, ...prev]);
        toast.success("Testimonio creado.");
      }
      router.refresh();
      handleClose();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete ───────────────────────────────────────────────────

  async function handleDelete(t: Testimonial) {
    if (!confirm(`¿Eliminar el testimonio de "${t.author_name}"?`)) return;
    try {
      await adminDb.delete("testimonials", t.id);
      setItems((prev) => prev.filter((x) => x.id !== t.id));
      toast.success("Testimonio eliminado.");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al eliminar. Intenta de nuevo.");
    }
  }

  // ── Toggle activo ────────────────────────────────────────────

  async function handleToggleActive(t: Testimonial) {
    const newValue = !t.is_active;
    try {
      await adminDb.update("testimonials", t.id, { is_active: newValue });
    } catch {
      // silently fallback
    }
    setItems((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, is_active: newValue } : x))
    );
    toast.success(newValue ? "Testimonio activado." : "Testimonio ocultado.");
  }

  // ── Render ───────────────────────────────────────────────────

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Testimonios</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} testimonio{items.length !== 1 ? "s" : ""} en total ·{" "}
            {items.filter((t) => t.is_active).length} activos
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Autor</TableHead>
              <TableHead>Testimonio</TableHead>
              <TableHead>Valoración</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                  <Star className="mx-auto h-8 w-8 mb-3 opacity-30" />
                  No hay testimonios todavía.
                </TableCell>
              </TableRow>
            ) : (
              items.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{t.author_name}</p>
                      {t.author_role && (
                        <p className="text-xs text-muted-foreground">{t.author_role}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground max-w-xs truncate">
                      {t.content}
                    </p>
                  </TableCell>
                  <TableCell>
                    <StarRating rating={t.rating} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.sort_order}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleActive(t)}
                      className="focus:outline-none"
                      title={t.is_active ? "Ocultar" : "Activar"}
                    >
                      <Badge variant={t.is_active ? "accent" : "secondary"}>
                        {t.is_active ? "Activo" : "Oculto"}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(t)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                        title="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar testimonio" : "Nuevo testimonio"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Modifica los datos del testimonio."
                : "Completa los datos para agregar un nuevo testimonio."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Nombre del autor <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                className={F}
                placeholder="Ej. María González"
                value={form.author_name}
                onChange={(e) => setField("author_name", e.target.value)}
              />
            </div>

            {/* Rol */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Rol / Descripción</label>
              <input
                type="text"
                className={F}
                placeholder="Ej. Socia desde 2023"
                value={form.author_role}
                onChange={(e) => setField("author_role", e.target.value)}
              />
            </div>

            {/* Contenido */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Testimonio <span className="text-destructive">*</span>
              </label>
              <textarea
                rows={4}
                className={F}
                placeholder="Escribe el testimonio aquí…"
                value={form.content}
                onChange={(e) => setField("content", e.target.value)}
              />
            </div>

            {/* Rating + Orden */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Valoración (1–5)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={form.rating}
                    onChange={(e) => setField("rating", e.target.value)}
                    className="flex-1 accent-amber-400"
                  />
                  <div className="flex gap-0.5 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Number(form.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Orden de aparición</label>
                <input
                  type="number"
                  min={0}
                  className={F}
                  placeholder="0"
                  value={form.sort_order}
                  onChange={(e) => setField("sort_order", e.target.value)}
                />
              </div>
            </div>

            {/* Activo */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 rounded accent-accent"
                checked={form.is_active}
                onChange={(e) => setField("is_active", e.target.checked)}
              />
              Mostrar en el sitio web
            </label>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              onClick={handleClose}
              disabled={saving}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Guardando…
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

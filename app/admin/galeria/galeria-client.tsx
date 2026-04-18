"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminDb } from "@/lib/admin-db";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Plus, Pencil, Trash2, Star, ImageIcon, Eye, EyeOff,
} from "lucide-react";
import { ImageUpload } from "@/components/shared/image-upload";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GalleryItem {
  id: string;
  created_at: string;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number | null;
  metadata: Record<string, unknown> | null;
}

type FormState = {
  title: string;
  description: string;
  image_url: string;
  category: string;
  sort_order: string;
  is_featured: boolean;
  is_active: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const F =
  "w-full rounded-xl border border-border px-3 py-2 text-sm bg-background outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

const CATEGORIES = [
  { value: "instalaciones", label: "Instalaciones" },
  { value: "canchas",       label: "Canchas" },
  { value: "eventos",       label: "Eventos" },
  { value: "torneos",       label: "Torneos" },
  { value: "clases",        label: "Clases" },
  { value: "social",        label: "Social" },
  { value: "general",       label: "General" },
] as const;

const defaultForm: FormState = {
  title: "",
  description: "",
  image_url: "",
  category: "general",
  sort_order: "",
  is_featured: false,
  is_active: true,
};

function itemToForm(item: GalleryItem): FormState {
  return {
    title: item.title ?? "",
    description: item.description ?? "",
    image_url: item.image_url,
    category: item.category ?? "general",
    sort_order: item.sort_order != null ? String(item.sort_order) : "",
    is_featured: item.is_featured,
    is_active: item.is_active,
  };
}

const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GaleriaClient({ items: initial }: { items: GalleryItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<GalleryItem | null>(null);

  // ── Modal helpers ─────────────────────────────────────────────

  function openNew() {
    setEditing(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(item: GalleryItem) {
    setEditing(item);
    setForm(itemToForm(item));
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
    if (!form.image_url.trim()) {
      toast.error("La URL de la imagen es obligatoria.");
      return;
    }
    setSaving(true);

    const payload = {
      title: form.title.trim() || null,
      description: form.description.trim() || null,
      image_url: form.image_url.trim(),
      category: form.category || "general",
      sort_order: form.sort_order !== "" ? Number(form.sort_order) : 0,
      is_featured: form.is_featured,
      is_active: form.is_active,
    };

    try {
      if (editing) {
        await adminDb.update("gallery_items", editing.id, payload);
        setItems((prev) =>
          prev.map((i) => (i.id === editing.id ? { ...i, ...payload } : i))
        );
        toast.success("Imagen actualizada.");
      } else {
        const data = await adminDb.insert<GalleryItem>("gallery_items", payload);
        setItems((prev) => [...prev, data]);
        toast.success("Imagen agregada.");
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

  async function handleDelete(item: GalleryItem) {
    if (!confirm(`¿Eliminar "${item.title ?? "esta imagen"}"?`)) return;
    try {
      await adminDb.delete("gallery_items", item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success("Imagen eliminada.");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al eliminar. Intenta de nuevo.");
    }
  }

  // ── Toggle activo ────────────────────────────────────────────

  async function handleToggleActive(item: GalleryItem) {
    const newValue = !item.is_active;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_active: newValue } : i))
    );
    try {
      await adminDb.update("gallery_items", item.id, { is_active: newValue });
      toast.success(newValue ? "Imagen activada." : "Imagen ocultada.");
    } catch {
      // silently fallback
    }
  }

  // ── Toggle destacada ─────────────────────────────────────────

  async function handleToggleFeatured(item: GalleryItem) {
    const newValue = !item.is_featured;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_featured: newValue } : i))
    );
    try {
      await adminDb.update("gallery_items", item.id, { is_featured: newValue });
      toast.success(newValue ? "Marcada como destacada." : "Desmarcada de destacadas.");
    } catch {
      // silently fallback
    }
  }

  // ── Render ───────────────────────────────────────────────────

  const activeCount = items.filter((i) => i.is_active).length;
  const featuredCount = items.filter((i) => i.is_featured).length;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Galería</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} imagen{items.length !== 1 ? "es" : ""} ·{" "}
            {activeCount} activas · {featuredCount} destacadas
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar imagen
        </button>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-sm mb-4">No hay imágenes en la galería.</p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Agregar primera imagen
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl border bg-background transition-all ${
                item.is_active ? "border-border" : "border-border/50 opacity-60"
              }`}
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-secondary">
                <Image
                  src={item.image_url}
                  alt={item.title ?? "Imagen galería"}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Overlay buttons */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setPreview(item)}
                    className="rounded-full bg-white/20 backdrop-blur p-2 text-white hover:bg-white/40 transition-colors"
                    title="Ver imagen"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-full bg-white/20 backdrop-blur p-2 text-white hover:bg-white/40 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="rounded-full bg-red-500/60 backdrop-blur p-2 text-white hover:bg-red-500/80 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Featured badge */}
                {item.is_featured && (
                  <div className="absolute top-2 left-2">
                    <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                      <Star className="h-3 w-3 fill-white" /> Destacada
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {item.title ?? "Sin título"}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {item.category && (
                        <Badge variant="secondary" className="text-xs">
                          {CATEGORY_LABELS[item.category] ?? item.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className={`rounded-md p-1.5 transition-colors ${
                        item.is_featured
                          ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950"
                          : "text-muted-foreground hover:bg-secondary"
                      }`}
                      title={item.is_featured ? "Quitar de destacadas" : "Marcar destacada"}
                    >
                      <Star className={`h-3.5 w-3.5 ${item.is_featured ? "fill-amber-500" : ""}`} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(item)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary transition-colors"
                      title={item.is_active ? "Ocultar" : "Mostrar"}
                    >
                      {item.is_active
                        ? <Eye className="h-3.5 w-3.5" />
                        : <EyeOff className="h-3.5 w-3.5" />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add card */}
          <button
            onClick={openNew}
            className="aspect-video rounded-2xl border-2 border-dashed border-border hover:border-accent/50 hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-accent"
          >
            <Plus className="h-8 w-8" />
            <p className="text-sm font-medium">Agregar imagen</p>
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar imagen" : "Agregar imagen"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Modifica los datos de la imagen."
                : "Pega la URL de una imagen para agregarla a la galería."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Imagen */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Imagen <span className="text-destructive">*</span>
              </label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setField("image_url", url)}
                folder="gallery"
                aspectRatio="video"
              />
            </div>

            {/* Título */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Título</label>
              <input
                type="text"
                className={F}
                placeholder="Ej. Canchas Indoor"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
              />
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Descripción</label>
              <textarea
                rows={2}
                className={F}
                placeholder="Descripción opcional..."
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            {/* Categoría + Orden */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Categoría</label>
                <select
                  className={F}
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Orden</label>
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

            {/* Checkboxes */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-accent"
                  checked={form.is_active}
                  onChange={(e) => setField("is_active", e.target.checked)}
                />
                Visible en galería
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-amber-400"
                  checked={form.is_featured}
                  onChange={(e) => setField("is_featured", e.target.checked)}
                />
                Destacada
              </label>
            </div>
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
              ) : "Guardar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview lightbox */}
      <Dialog open={!!preview} onOpenChange={(v) => { if (!v) setPreview(null); }}>
        <DialogContent className="max-w-3xl p-2">
          {preview && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
              <Image
                src={preview.image_url}
                alt={preview.title ?? "Imagen"}
                fill
                unoptimized
                className="object-contain"
                sizes="800px"
              />
            </div>
          )}
          {preview?.title && (
            <p className="text-center text-sm font-medium pt-1 pb-2">{preview.title}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

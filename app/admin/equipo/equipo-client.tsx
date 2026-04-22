"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminDb } from "@/lib/admin-db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff, Crosshair } from "lucide-react";
import { ImageUpload } from "@/components/shared/image-upload";
import type { TeamMember } from "@/services/team";

// ── Form state ────────────────────────────────────────────────────────────────

type FormState = {
  name: string;
  role: string;
  bio: string;
  image_url: string;
  object_position: string;
  sort_order: string;
  is_active: boolean;
};

const defaultForm: FormState = {
  name: "",
  role: "",
  bio: "",
  image_url: "",
  object_position: "50% 20%",
  sort_order: "",
  is_active: true,
};

function memberToForm(m: TeamMember): FormState {
  return {
    name: m.name,
    role: m.role,
    bio: m.bio ?? "",
    image_url: m.image_url ?? "",
    object_position: m.object_position ?? "50% 20%",
    sort_order: m.sort_order != null ? String(m.sort_order) : "",
    is_active: m.is_active,
  };
}

const F =
  "w-full rounded-xl border border-border px-3 py-2 text-sm bg-background outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

// ── Focal point picker ────────────────────────────────────────────────────────

interface FocalPickerProps {
  imageUrl: string;
  value: string; // e.g. "50% 20%"
  onChange: (v: string) => void;
}

function FocalPicker({ imageUrl, value, onChange }: FocalPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
      onChange(`${x}% ${y}%`);
    },
    [onChange]
  );

  // Parse current value
  const parts = value.split(" ");
  const dotX = parts[0] ?? "50%";
  const dotY = parts[1] ?? "20%";

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
        <Crosshair className="h-3.5 w-3.5" />
        Haz clic en la imagen para centrar el recorte en esa zona
      </p>
      <div
        ref={containerRef}
        onClick={handleClick}
        className="relative cursor-crosshair overflow-hidden rounded-xl border border-border select-none"
        style={{ aspectRatio: "3/2" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Foto"
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
        {/* Focal point dot */}
        <div
          className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-accent shadow-lg pointer-events-none"
          style={{ left: dotX, top: dotY }}
        />
        {/* Overlay guide */}
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>
      {/* Portrait preview */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Vista previa del recorte (como se verá en la web)</p>
        <div className="w-32 overflow-hidden rounded-xl border border-border" style={{ aspectRatio: "3/4" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-cover"
            style={{ objectPosition: value }}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground font-mono bg-secondary/50 px-2 py-1 rounded-md w-fit">
        object-position: {value}
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function EquipoClient({ members: initial }: { members: TeamMember[] }) {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[]>(initial);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);

  function setField<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function openNew() {
    setEditing(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(m: TeamMember) {
    setEditing(m);
    setForm(memberToForm(m));
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setEditing(null);
    setForm(defaultForm);
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error("El nombre es obligatorio."); return; }
    if (!form.role.trim()) { toast.error("El cargo es obligatorio."); return; }
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      bio: form.bio.trim() || null,
      image_url: form.image_url.trim() || null,
      object_position: form.object_position || "50% 20%",
      sort_order: form.sort_order !== "" ? Number(form.sort_order) : 0,
      is_active: form.is_active,
    };

    try {
      if (editing) {
        await adminDb.update("team_members", editing.id, payload);
        setMembers((prev) =>
          prev.map((m) => (m.id === editing.id ? { ...m, ...payload } : m))
        );
        toast.success("Miembro actualizado.");
      } else {
        const data = await adminDb.insert<TeamMember>("team_members", payload);
        setMembers((prev) => [...prev, data]);
        toast.success("Miembro añadido.");
      }
      router.refresh();
      handleClose();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(m: TeamMember) {
    if (!confirm(`¿Eliminar a "${m.name}"?`)) return;
    try {
      await adminDb.delete("team_members", m.id);
      setMembers((prev) => prev.filter((x) => x.id !== m.id));
      toast.success("Miembro eliminado.");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al eliminar.");
    }
  }

  async function handleToggleActive(m: TeamMember) {
    const newVal = !m.is_active;
    setMembers((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_active: newVal } : x)));
    try {
      await adminDb.update("team_members", m.id, { is_active: newVal });
      toast.success(newVal ? "Visible en el club." : "Ocultado del club.");
    } catch { /* silent */ }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Equipo</h1>
          <p className="text-sm text-muted-foreground">
            {members.length} miembro{members.length !== 1 ? "s" : ""} ·{" "}
            {members.filter((m) => m.is_active).length} visibles
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Añadir miembro
        </button>
      </div>

      {/* Info banner */}
      <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-muted-foreground">
        <strong className="text-foreground">💡 Consejo:</strong> Al editar cada miembro, usa el selector de punto focal
        para ajustar exactamente qué parte de la foto se muestra en el recorte de la web.
      </div>

      {/* Grid */}
      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground mb-4">No hay miembros del equipo.</p>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent/90"
          >
            <Plus className="h-4 w-4" />
            Añadir primer miembro
          </button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div
              key={m.id}
              className={`group rounded-2xl border bg-background overflow-hidden transition-all ${
                m.is_active ? "border-border" : "border-border/50 opacity-60"
              }`}
            >
              {/* Photo */}
              <div className="relative h-56 bg-secondary overflow-hidden">
                {m.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.image_url}
                    alt={m.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ objectPosition: m.object_position ?? "center top" }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl">
                    👤
                  </div>
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(m)}
                    className="rounded-full bg-white/20 backdrop-blur p-2.5 text-white hover:bg-white/40 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(m)}
                    className="rounded-full bg-red-500/60 backdrop-blur p-2.5 text-white hover:bg-red-500/80 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{m.name}</p>
                    <p className="text-xs text-accent mt-0.5">{m.role}</p>
                    {m.bio && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{m.bio}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleActive(m)}
                    className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-secondary transition-colors"
                    title={m.is_active ? "Ocultar" : "Mostrar"}
                  >
                    {m.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {/* Add card */}
          <button
            onClick={openNew}
            className="h-56 rounded-2xl border-2 border-dashed border-border hover:border-accent/50 hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-accent"
          >
            <Plus className="h-8 w-8" />
            <p className="text-sm font-medium">Añadir miembro</p>
          </button>
        </div>
      )}

      {/* Create / Edit modal */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="max-w-xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar miembro" : "Añadir miembro del equipo"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifica los datos y la foto del miembro." : "Completa la información del nuevo integrante."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Nombre + Cargo */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Nombre <span className="text-destructive">*</span></label>
                <input className={F} placeholder="Carlos Mendoza" value={form.name} onChange={(e) => setField("name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Cargo <span className="text-destructive">*</span></label>
                <input className={F} placeholder="Director Técnico" value={form.role} onChange={(e) => setField("role", e.target.value)} />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Descripción</label>
              <textarea
                rows={2}
                className={F}
                placeholder="Breve bio del entrenador..."
                value={form.bio}
                onChange={(e) => setField("bio", e.target.value)}
              />
            </div>

            {/* Orden + Activo */}
            <div className="flex items-center gap-4">
              <div className="space-y-1.5 w-28">
                <label className="text-sm font-medium">Orden</label>
                <input type="number" min={0} className={F} placeholder="1" value={form.sort_order} onChange={(e) => setField("sort_order", e.target.value)} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm mt-5">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-accent"
                  checked={form.is_active}
                  onChange={(e) => setField("is_active", e.target.checked)}
                />
                Visible en la web
              </label>
            </div>

            {/* Foto */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Foto</label>
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setField("image_url", url)}
                folder="team"
                aspectRatio="square"
              />
            </div>

            {/* Focal point picker */}
            {form.image_url && (
              <div className="space-y-1.5 border-t border-border pt-4">
                <label className="text-sm font-medium">Centrado de foto</label>
                <FocalPicker
                  imageUrl={form.image_url}
                  value={form.object_position}
                  onChange={(v) => setField("object_position", v)}
                />
              </div>
            )}
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
    </>
  );
}

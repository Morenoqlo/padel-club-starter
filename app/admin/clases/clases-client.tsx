"use client";

import { useState } from "react";
import { adminDb } from "@/lib/admin-db";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
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
import { Pencil, Trash2, Plus, Clock, User } from "lucide-react";

const F =
  "w-full rounded-xl border border-border px-3 py-2 text-sm bg-background outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

export interface Class {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  level: string | null;
  instructor: string | null;
  schedule: unknown;
  duration_minutes: number | null;
  price_per_session: number | null;
  price_monthly: number | null;
  max_students: number | null;
  is_active: boolean;
  is_featured: boolean;
}

type FormState = {
  name: string;
  description: string;
  level: string;
  instructor: string;
  duration_minutes: string;
  price_per_session: string;
  price_monthly: string;
  max_students: string;
  is_active: boolean;
  is_featured: boolean;
};

const defaultForm: FormState = {
  name: "",
  description: "",
  level: "",
  instructor: "",
  duration_minutes: "",
  price_per_session: "",
  price_monthly: "",
  max_students: "",
  is_active: true,
  is_featured: false,
};

function classToForm(c: Class): FormState {
  return {
    name: c.name,
    description: c.description ?? "",
    level: c.level ?? "",
    instructor: c.instructor ?? "",
    duration_minutes: c.duration_minutes != null ? String(c.duration_minutes) : "",
    price_per_session: c.price_per_session != null ? String(c.price_per_session) : "",
    price_monthly: c.price_monthly != null ? String(c.price_monthly) : "",
    max_students: c.max_students != null ? String(c.max_students) : "",
    is_active: c.is_active,
    is_featured: c.is_featured,
  };
}

function levelBadge(level: string | null) {
  switch (level) {
    case "beginner":
      return <Badge variant="accent">Principiante</Badge>;
    case "intermediate":
      return <Badge variant="warning">Intermedio</Badge>;
    case "advanced":
      return <Badge variant="destructive">Avanzado</Badge>;
    default:
      return <Badge variant="secondary">{level ?? "—"}</Badge>;
  }
}

function schedulePreview(schedule: unknown): string {
  if (!schedule) return "—";
  if (typeof schedule === "string") return schedule.slice(0, 40);
  try {
    return JSON.stringify(schedule).slice(0, 40);
  } catch {
    return "—";
  }
}

export function ClasesClient({ classes }: { classes: Class[] }) {
  const router = useRouter();
  const [items, setItems] = useState<Class[]>(classes);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Class | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(cls: Class) {
    setEditing(cls);
    setForm(classToForm(cls));
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
    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description || null,
      level: form.level || null,
      instructor: form.instructor || null,
      duration_minutes: form.duration_minutes !== "" ? Number(form.duration_minutes) : null,
      price_per_session: form.price_per_session !== "" ? Number(form.price_per_session) : null,
      price_monthly: form.price_monthly !== "" ? Number(form.price_monthly) : null,
      max_students: form.max_students !== "" ? Number(form.max_students) : null,
      is_active: form.is_active,
      is_featured: form.is_featured,
    };

    try {
      if (editing) {
        await adminDb.update("classes", editing.id, payload);
        setItems((prev) =>
          prev.map((c) => (c.id === editing.id ? { ...c, ...payload } : c))
        );
        toast.success("Clase actualizada.");
      } else {
        const slug = form.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "");
        const data = await adminDb.insert<Class>("classes", {
          ...payload, slug, schedule: null,
        });
        setItems((prev) => [data, ...prev]);
        toast.success("Clase creada.");
      }
      router.refresh();
      handleClose();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cls: Class) {
    if (!confirm(`¿Eliminar "${cls.name}"?`)) return;
    try {
      await adminDb.delete("classes", cls.id);
      setItems((prev) => prev.filter((c) => c.id !== cls.id));
      toast.success("Clase eliminada.");
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
          <h1 className="text-2xl font-bold">Clases</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} clase{items.length !== 1 ? "s" : ""}
          </p>
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
              <TableHead>Clase</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Precio/sesión</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No hay clases registradas.
                </TableCell>
              </TableRow>
            ) : (
              items.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell>
                    <div className="font-medium">{cls.name}</div>
                    {cls.schedule != null && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">
                        {schedulePreview(cls.schedule)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{levelBadge(cls.level)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      {cls.instructor ? (
                        <>
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {cls.instructor}
                        </>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {cls.duration_minutes != null ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        {cls.duration_minutes}min
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {cls.price_per_session != null
                      ? formatPrice(cls.price_per_session)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {cls.is_active && <Badge variant="default">Activo</Badge>}
                      {cls.is_featured && <Badge variant="secondary">Destacado</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(cls)}
                        className="rounded-lg p-1.5 hover:bg-muted transition-colors"
                        aria-label="Editar clase"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cls)}
                        className="rounded-lg p-1.5 hover:bg-destructive/10 text-destructive transition-colors"
                        aria-label="Eliminar clase"
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
            <DialogTitle>{editing ? "Editar clase" : "Nueva clase"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Nombre */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Nombre <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                className={F}
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Nombre de la clase"
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
                placeholder="Descripción de la clase"
              />
            </div>

            {/* Nivel */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Nivel</label>
              <select
                className={F}
                value={form.level}
                onChange={(e) => setField("level", e.target.value)}
              >
                <option value="">Sin nivel</option>
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>

            {/* Instructor */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Instructor</label>
              <input
                type="text"
                className={F}
                value={form.instructor}
                onChange={(e) => setField("instructor", e.target.value)}
                placeholder="Nombre del instructor"
              />
            </div>

            {/* Duración */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Duración en minutos</label>
              <input
                type="number"
                className={F}
                value={form.duration_minutes}
                onChange={(e) => setField("duration_minutes", e.target.value)}
                placeholder="60"
                min="1"
              />
            </div>

            {/* Precio por sesión */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Precio por sesión</label>
              <input
                type="number"
                className={F}
                value={form.price_per_session}
                onChange={(e) => setField("price_per_session", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Precio mensual */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Precio mensual</label>
              <input
                type="number"
                className={F}
                value={form.price_monthly}
                onChange={(e) => setField("price_monthly", e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Máx. alumnos */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Máx. alumnos</label>
              <input
                type="number"
                className={F}
                value={form.max_students}
                onChange={(e) => setField("max_students", e.target.value)}
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

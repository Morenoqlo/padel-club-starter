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
import { Pencil, Trash2, Plus } from "lucide-react";

const F =
  "w-full rounded-xl border border-border px-3 py-2 text-sm bg-background outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

const CATEGORY_LABELS: Record<string, string> = {
  reservas: "Reservas",
  instalaciones: "Instalaciones",
  clases: "Clases",
  pagos: "Pagos",
  general: "General",
};

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number | null;
  is_active: boolean;
}

type FormState = {
  question: string;
  answer: string;
  category: string;
  sort_order: string;
  is_active: boolean;
};

const defaultForm: FormState = {
  question: "",
  answer: "",
  category: "",
  sort_order: "",
  is_active: true,
};

function faqToForm(f: FAQ): FormState {
  return {
    question: f.question,
    answer: f.answer,
    category: f.category ?? "",
    sort_order: f.sort_order != null ? String(f.sort_order) : "",
    is_active: f.is_active,
  };
}

function categoryBadge(category: string | null) {
  const label = category ? (CATEGORY_LABELS[category] ?? category) : null;
  return label ? (
    <Badge variant="secondary">{label}</Badge>
  ) : (
    <span className="text-muted-foreground text-sm">—</span>
  );
}

export function FaqClient({ faqs }: { faqs: FAQ[] }) {
  const router = useRouter();
  const [items, setItems] = useState<FAQ[]>(faqs);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);

  function openNew() {
    setEditing(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(faq: FAQ) {
    setEditing(faq);
    setForm(faqToForm(faq));
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
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error("Pregunta y respuesta son obligatorias.");
      return;
    }
    setSaving(true);

    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category || null,
      sort_order: form.sort_order !== "" ? Number(form.sort_order) : null,
      is_active: form.is_active,
    };

    try {
      if (editing) {
        await adminDb.update("faq", editing.id, payload);
        setItems((prev) =>
          prev.map((f) => (f.id === editing.id ? { ...f, ...payload } : f))
        );
        toast.success("FAQ actualizada.");
      } else {
        const data = await adminDb.insert<FAQ>("faq", payload);
        setItems((prev) => [...prev, data]);
        toast.success("FAQ creada.");
      }
      router.refresh();
      handleClose();
    } catch {
      toast.success("Guardado (modo demo)");
      if (editing) {
        setItems((prev) =>
          prev.map((f) => (f.id === editing.id ? { ...f, ...payload } : f))
        );
      } else {
        const newItem: FAQ = {
          id: crypto.randomUUID(),
          ...payload,
        };
        setItems((prev) => [...prev, newItem]);
      }
      handleClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(faq: FAQ) {
    if (!confirm(`¿Eliminar esta pregunta?`)) return;
    try {
      await adminDb.delete("faq", faq.id);
      setItems((prev) => prev.filter((f) => f.id !== faq.id));
      toast.success("FAQ eliminada.");
      router.refresh();
    } catch {
      setItems((prev) => prev.filter((f) => f.id !== faq.id));
      toast.success("Guardado (modo demo)");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FAQ</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} pregunta{items.length !== 1 ? "s" : ""}
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
              <TableHead>Pregunta</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No hay preguntas frecuentes registradas.
                </TableCell>
              </TableRow>
            ) : (
              items.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell>
                    <div className="font-medium">{faq.question}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[320px]">
                      {faq.answer.slice(0, 60)}{faq.answer.length > 60 ? "…" : ""}
                    </div>
                  </TableCell>
                  <TableCell>{categoryBadge(faq.category)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {faq.sort_order != null ? faq.sort_order : "—"}
                  </TableCell>
                  <TableCell>
                    {faq.is_active && <Badge variant="default">Activo</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(faq)}
                        className="rounded-lg p-1.5 hover:bg-muted transition-colors"
                        aria-label="Editar FAQ"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq)}
                        className="rounded-lg p-1.5 hover:bg-destructive/10 text-destructive transition-colors"
                        aria-label="Eliminar FAQ"
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
            <DialogTitle>{editing ? "Editar pregunta" : "Nueva pregunta"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Pregunta */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Pregunta <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                className={F}
                value={form.question}
                onChange={(e) => setField("question", e.target.value)}
                placeholder="¿Cuál es la pregunta?"
              />
            </div>

            {/* Respuesta */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Respuesta <span className="text-destructive">*</span>
              </label>
              <textarea
                className={F}
                rows={4}
                value={form.answer}
                onChange={(e) => setField("answer", e.target.value)}
                placeholder="Escribe la respuesta aquí…"
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
                <option value="reservas">Reservas</option>
                <option value="instalaciones">Instalaciones</option>
                <option value="clases">Clases</option>
                <option value="pagos">Pagos</option>
                <option value="general">General</option>
              </select>
            </div>

            {/* Orden */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Orden</label>
              <input
                type="number"
                className={F}
                value={form.sort_order}
                onChange={(e) => setField("sort_order", e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            {/* Checkbox Activo */}
            <div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setField("is_active", e.target.checked)}
                  className="rounded"
                />
                Activo
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

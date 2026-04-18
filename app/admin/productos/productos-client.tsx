"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Package, ExternalLink, Pencil, Trash2 } from "lucide-react";

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
import { adminDb } from "@/lib/admin-db";
import { formatPrice } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string | null;
  stock_quantity: number | null;
  is_active: boolean;
  is_featured: boolean;
  images: string[] | null;
  sku: string | null;
};

type FormState = {
  name: string;
  slug: string;
  description: string;
  price: string;
  compare_at_price: string;
  category: string;
  stock_quantity: string;
  is_active: boolean;
  is_featured: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const CATEGORIES = [
  { value: "accesorios", label: "Accesorios" },
  { value: "ropa", label: "Ropa" },
  { value: "palas", label: "Palas" },
  { value: "pelotas", label: "Pelotas" },
  { value: "otros", label: "Otros" },
] as const;

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  description: "",
  price: "",
  compare_at_price: "",
  category: "",
  stock_quantity: "",
  is_active: true,
  is_featured: false,
};

const F =
  "w-full rounded-xl border border-border px-3 py-2 text-sm bg-background outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

// ---------------------------------------------------------------------------
// ProductosClient
// ---------------------------------------------------------------------------

export function ProductosClient({ products }: { products: Product[] }) {
  const router = useRouter();

  const [items, setItems] = useState<Product[]>(products);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // -------------------------------------------------------------------------
  // Modal helpers
  // -------------------------------------------------------------------------

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      price: product.price.toString(),
      compare_at_price: product.compare_at_price?.toString() ?? "",
      category: product.category ?? "",
      stock_quantity: product.stock_quantity?.toString() ?? "",
      is_active: product.is_active,
      is_featured: product.is_featured,
    });
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  // -------------------------------------------------------------------------
  // Field handlers
  // -------------------------------------------------------------------------

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      // Only auto-generate slug when creating
      slug: editing ? prev.slug : toSlug(value),
    }));
  }

  // -------------------------------------------------------------------------
  // Save
  // -------------------------------------------------------------------------

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    if (!form.price || isNaN(Number(form.price))) {
      toast.error("Ingresa un precio válido.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || toSlug(form.name),
      description: form.description.trim() || null,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      category: form.category || null,
      stock_quantity: form.stock_quantity ? Number(form.stock_quantity) : null,
      is_active: form.is_active,
      is_featured: form.is_featured,
    };

    try {
      if (editing) {
        const data = await adminDb.update<Product>("products", editing.id, payload);
        setItems((prev) =>
          prev.map((p) => (p.id === editing.id ? data : p))
        );
        toast.success("Producto actualizado.");
      } else {
        const data = await adminDb.insert<Product>("products", payload);
        setItems((prev) => [data, ...prev]);
        toast.success("Producto creado.");
      }

      router.refresh();
      closeModal();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  // -------------------------------------------------------------------------
  // Delete
  // -------------------------------------------------------------------------

  async function handleDelete(product: Product) {
    const confirmed = confirm(
      `¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      await adminDb.delete("products", product.id);
      setItems((prev) => prev.filter((p) => p.id !== product.id));
      toast.success("Producto eliminado.");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message ?? "Error al eliminar. Intenta de nuevo.");
    }
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Productos</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} producto{items.length !== 1 ? "s" : ""} en total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((product) => (
              <TableRow key={product.id}>
                {/* Producto */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-secondary">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <Package className="h-5 w-5 m-auto mt-2.5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.slug}</p>
                    </div>
                  </div>
                </TableCell>

                {/* Categoría */}
                <TableCell>
                  <span className="capitalize text-sm text-muted-foreground">
                    {product.category ?? "—"}
                  </span>
                </TableCell>

                {/* Precio */}
                <TableCell>
                  <div>
                    <p className="font-semibold text-sm">{formatPrice(product.price)}</p>
                    {product.compare_at_price && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.compare_at_price)}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Stock */}
                <TableCell>
                  <span className="text-sm">{product.stock_quantity ?? "∞"}</span>
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <Badge variant={product.is_active ? "accent" : "secondary"}>
                    {product.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                  {product.is_featured && (
                    <Badge variant="warning" className="ml-1.5">
                      Destacado
                    </Badge>
                  )}
                </TableCell>

                {/* Acciones */}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/producto/${product.slug}`}
                      target="_blank"
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      title="Ver en web"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => openEdit(product)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {items.length === 0 && (
          <div className="py-16 text-center">
            <Package className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">No hay productos creados.</p>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) closeModal(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar producto" : "Nuevo producto"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Modifica los datos del producto y guarda los cambios."
                : "Completa los datos para crear un nuevo producto."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Nombre */}
            <div className="grid gap-1.5">
              <label className="text-sm font-medium" htmlFor="prod-name">
                Nombre <span className="text-destructive">*</span>
              </label>
              <input
                id="prod-name"
                type="text"
                className={F}
                placeholder="Ej. Pala Head Delta Pro"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            {/* Slug */}
            <div className="grid gap-1.5">
              <label className="text-sm font-medium" htmlFor="prod-slug">
                Slug
              </label>
              <div className="flex gap-2">
                <input
                  id="prod-slug"
                  type="text"
                  className={F}
                  placeholder="pala-head-delta-pro"
                  value={form.slug}
                  onChange={(e) => setField("slug", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setField("slug", toSlug(form.name))}
                  className="shrink-0 rounded-xl border border-border px-3 py-2 text-sm hover:bg-secondary transition-colors"
                >
                  Generar
                </button>
              </div>
            </div>

            {/* Descripción */}
            <div className="grid gap-1.5">
              <label className="text-sm font-medium" htmlFor="prod-desc">
                Descripción
              </label>
              <textarea
                id="prod-desc"
                rows={3}
                className={F}
                placeholder="Descripción del producto..."
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </div>

            {/* Precio / Precio anterior */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium" htmlFor="prod-price">
                  Precio (CLP) <span className="text-destructive">*</span>
                </label>
                <input
                  id="prod-price"
                  type="number"
                  min={0}
                  className={F}
                  placeholder="29990"
                  value={form.price}
                  onChange={(e) => setField("price", e.target.value)}
                />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium" htmlFor="prod-compare">
                  Precio anterior (CLP)
                </label>
                <input
                  id="prod-compare"
                  type="number"
                  min={0}
                  className={F}
                  placeholder="39990"
                  value={form.compare_at_price}
                  onChange={(e) => setField("compare_at_price", e.target.value)}
                />
              </div>
            </div>

            {/* Categoría / Stock */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium" htmlFor="prod-category">
                  Categoría
                </label>
                <select
                  id="prod-category"
                  className={F}
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                >
                  <option value="">Sin categoría</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium" htmlFor="prod-stock">
                  Stock
                </label>
                <input
                  id="prod-stock"
                  type="number"
                  min={0}
                  className={F}
                  placeholder="∞"
                  value={form.stock_quantity}
                  onChange={(e) => setField("stock_quantity", e.target.value)}
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
                Activo
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-accent"
                  checked={form.is_featured}
                  onChange={(e) => setField("is_featured", e.target.checked)}
                />
                Destacado
              </label>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
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

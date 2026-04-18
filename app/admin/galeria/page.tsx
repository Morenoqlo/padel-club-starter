import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Plus, Pencil, Trash2, Star } from "lucide-react";
import Image from "next/image";

const mockGallery = [
  { id: "1", title: "Canchas Indoor", category: "instalaciones", is_featured: true, is_active: true, image_url: "https://placehold.co/400x300/0A0A0A/22C55E?text=Indoor", sort_order: 1 },
  { id: "2", title: "Canchas Outdoor", category: "instalaciones", is_featured: true, is_active: true, image_url: "https://placehold.co/400x300/22C55E/0A0A0A?text=Outdoor", sort_order: 2 },
  { id: "3", title: "Torneo Verano", category: "torneos", is_featured: false, is_active: true, image_url: "https://placehold.co/400x300/111111/FFFFFF?text=Torneo", sort_order: 3 },
  { id: "4", title: "Academia Infantil", category: "clases", is_featured: false, is_active: true, image_url: "https://placehold.co/400x300/0A0A0A/22C55E?text=Academia", sort_order: 4 },
  { id: "5", title: "Pro Shop", category: "instalaciones", is_featured: false, is_active: true, image_url: "https://placehold.co/400x300/22C55E/111111?text=Shop", sort_order: 5 },
  { id: "6", title: "BBQ Night", category: "eventos", is_featured: false, is_active: true, image_url: "https://placehold.co/400x300/111111/22C55E?text=BBQ", sort_order: 6 },
];

const CATEGORY_LABELS: Record<string, string> = {
  instalaciones: "Instalaciones",
  torneos: "Torneos",
  clases: "Clases",
  eventos: "Eventos",
};

async function getGallery() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order");
    return data ?? mockGallery;
  } catch {
    return mockGallery;
  }
}

export default async function AdminGaleriaPage() {
  const items = await getGallery();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">Galería</h1>
          <p className="text-sm text-muted-foreground">
            {items.length} imagen{items.length !== 1 ? "es" : ""} en la galería
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors">
          <Plus className="h-4 w-4" />
          Subir imagen
        </button>
      </div>

      {/* Grid view */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border border-border bg-background"
          >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden bg-secondary">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {item.is_featured && (
                <div className="absolute top-2 left-2">
                  <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-white">
                    <Star className="h-3 w-3" /> Destacada
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {item.category && (
                      <Badge variant="secondary" className="text-xs capitalize">
                        {CATEGORY_LABELS[item.category] ?? item.category}
                      </Badge>
                    )}
                    <Badge variant={item.is_active ? "accent" : "secondary"} className="text-xs">
                      {item.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Upload placeholder */}
        <button className="aspect-video rounded-2xl border-2 border-dashed border-border hover:border-accent/50 hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-accent">
          <Plus className="h-8 w-8" />
          <p className="text-sm font-medium">Subir nueva imagen</p>
        </button>
      </div>
    </div>
  );
}

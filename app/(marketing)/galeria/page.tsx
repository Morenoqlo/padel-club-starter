import type { Metadata } from "next";
import { getGalleryItems } from "@/services/gallery";
import { brandConfig } from "@/config/brand";
import { GaleriaClient } from "@/components/sections/galeria-client";

export const metadata: Metadata = {
  title: "Galería",
  description: `Conoce las instalaciones y momentos de ${brandConfig.name}`,
};

export const revalidate = 600;

// Mock gallery when Supabase isn't connected
const mockGallery = [
  {
    id: "1",
    created_at: new Date().toISOString(),
    title: "Canchas Indoor",
    description: "Vista panorámica de nuestras 4 canchas techadas",
    image_url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80&auto=format&fit=crop",
    category: "instalaciones",
    sort_order: 1,
    is_featured: true,
    is_active: true,
  },
  {
    id: "2",
    created_at: new Date().toISOString(),
    title: "Canchas Outdoor",
    description: "Canchas al aire libre con vista panorámica",
    image_url: "https://images.unsplash.com/photo-1611457194403-d3aca4cf9d11?w=800&q=80&auto=format&fit=crop",
    category: "instalaciones",
    sort_order: 2,
    is_featured: true,
    is_active: true,
  },
  {
    id: "3",
    created_at: new Date().toISOString(),
    title: "Torneo Verano 2025",
    description: "Finales del torneo más emocionante del año",
    image_url: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80&auto=format&fit=crop",
    category: "torneos",
    sort_order: 3,
    is_featured: false,
    is_active: true,
  },
  {
    id: "4",
    created_at: new Date().toISOString(),
    title: "Academia Infantil",
    description: "Nuestros pequeños jugadores en acción",
    image_url: "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=800&q=80&auto=format&fit=crop",
    category: "clases",
    sort_order: 4,
    is_featured: false,
    is_active: true,
  },
  {
    id: "5",
    created_at: new Date().toISOString(),
    title: "Pro Shop",
    description: "Todo el equipamiento que necesitas",
    image_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80&auto=format&fit=crop",
    category: "instalaciones",
    sort_order: 5,
    is_featured: false,
    is_active: true,
  },
  {
    id: "6",
    created_at: new Date().toISOString(),
    title: "Clínica con Pros",
    description: "Entrenamiento con jugadores de nivel profesional",
    image_url: "https://images.unsplash.com/photo-1542144582-1ba00456b5e3?w=800&q=80&auto=format&fit=crop",
    category: "clases",
    sort_order: 6,
    is_featured: false,
    is_active: true,
  },
  {
    id: "7",
    created_at: new Date().toISOString(),
    title: "Área de calentamiento",
    description: "Gimnasio y área de calentamiento equipada",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80&auto=format&fit=crop",
    category: "instalaciones",
    sort_order: 7,
    is_featured: false,
    is_active: true,
  },
  {
    id: "8",
    created_at: new Date().toISOString(),
    title: "Noche de Pádel BBQ",
    description: "Evento social más esperado del año",
    image_url: "https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=800&q=80&auto=format&fit=crop",
    category: "eventos",
    sort_order: 8,
    is_featured: false,
    is_active: true,
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  instalaciones: "Instalaciones",
  torneos: "Torneos",
  clases: "Clases",
  eventos: "Eventos",
  social: "Social",
};

export default async function GaleriaPage() {
  const rawItems = await getGalleryItems().catch(() => mockGallery);
  // Only show items that have an actual image URL
  const items = rawItems
    .filter((i) => typeof i.image_url === "string" && i.image_url.length > 0)
    .map((i) => ({ ...i, image_url: i.image_url as string }));

  const featured = items.filter((i) => i.is_featured).slice(0, 3);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="section-sm border-b border-border bg-secondary/30">
        <div className="container">
          <p className="label-overline mb-3">Instalaciones & momentos</p>
          <h1 className="heading-xl">Galería</h1>
          <p className="mt-4 body-lg max-w-xl">
            Conoce nuestras instalaciones de primera clase y revive los mejores
            momentos del club.
          </p>
        </div>
      </section>

      {/* Client-side gallery with lightbox */}
      <GaleriaClient
        items={items}
        featured={featured}
        categoryLabels={CATEGORY_LABELS}
      />

      {/* Instagram CTA */}
      {brandConfig.social.instagram && (
        <section className="section border-t border-border bg-secondary/30">
          <div className="container text-center">
            <p className="label-overline mb-4">Más contenido</p>
            <h2 className="heading-md mb-3">Síguenos en Instagram</h2>
            <p className="body-md mb-6">
              Publicamos fotos, videos y stories del club todos los días.
            </p>
            <a
              href={brandConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors"
            >
              @{brandConfig.social.instagram.split("/").pop()}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}

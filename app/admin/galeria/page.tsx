import { GaleriaClient } from "./galeria-client";

const mockGallery = [
  { id: "1", created_at: new Date().toISOString(), title: "Canchas Indoor", description: null, category: "instalaciones", is_featured: true, is_active: true, image_url: "https://placehold.co/800x600/0A0A0A/22C55E?text=Cancha+Indoor", sort_order: 1, metadata: null },
  { id: "2", created_at: new Date().toISOString(), title: "Canchas Outdoor", description: null, category: "instalaciones", is_featured: true, is_active: true, image_url: "https://placehold.co/800x600/22C55E/0A0A0A?text=Cancha+Outdoor", sort_order: 2, metadata: null },
  { id: "3", created_at: new Date().toISOString(), title: "Torneo Verano", description: null, category: "torneos", is_featured: false, is_active: true, image_url: "https://placehold.co/800x600/111111/FFFFFF?text=Torneo", sort_order: 3, metadata: null },
  { id: "4", created_at: new Date().toISOString(), title: "Academia Infantil", description: null, category: "clases", is_featured: false, is_active: true, image_url: "https://placehold.co/800x600/0A0A0A/22C55E?text=Academia", sort_order: 4, metadata: null },
  { id: "5", created_at: new Date().toISOString(), title: "Pro Shop", description: null, category: "instalaciones", is_featured: false, is_active: true, image_url: "https://placehold.co/800x600/22C55E/111111?text=Shop", sort_order: 5, metadata: null },
  { id: "6", created_at: new Date().toISOString(), title: "BBQ Night", description: null, category: "eventos", is_featured: false, is_active: true, image_url: "https://placehold.co/800x600/111111/22C55E?text=BBQ", sort_order: 6, metadata: null },
];

async function getGallery() {
  try {
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();
    const { data } = await (supabase as any)
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? mockGallery;
  } catch {
    return mockGallery;
  }
}

export default async function AdminGaleriaPage() {
  const items = await getGallery();
  return <GaleriaClient items={items} />;
}

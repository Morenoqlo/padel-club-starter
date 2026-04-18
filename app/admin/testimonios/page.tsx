import { mockTestimonials } from "@/lib/mock-data";
import { TestimoniosClient } from "./testimonios-client";

async function getTestimonials() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? mockTestimonials;
  } catch {
    return mockTestimonials;
  }
}

export default async function AdminTestimoniosPage() {
  const testimonials = await getTestimonials();
  return <TestimoniosClient testimonials={testimonials as any} />;
}

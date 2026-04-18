import { mockFAQs } from "@/lib/mock-data";
import { FaqClient } from "./faq-client";

async function getFAQs() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("faq")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? mockFAQs;
  } catch {
    return mockFAQs;
  }
}

export default async function AdminFaqPage() {
  const faqs = await getFAQs();
  return <FaqClient faqs={faqs as any} />;
}

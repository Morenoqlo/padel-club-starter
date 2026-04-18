import { mockClasses } from "@/lib/mock-data";
import { ClasesClient } from "./clases-client";

async function getClasses() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("classes")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? mockClasses;
  } catch {
    return mockClasses;
  }
}

export default async function AdminClasesPage() {
  const classes = await getClasses();
  return <ClasesClient classes={classes as any} />;
}

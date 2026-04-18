import { mockOrders } from "@/lib/mock-data";
import { OrdenesClient } from "./ordenes-client";

async function getOrders() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    return data ?? mockOrders;
  } catch {
    return mockOrders;
  }
}

export default async function AdminOrdenesPage() {
  const orders = await getOrders();
  return <OrdenesClient orders={orders as any} />;
}

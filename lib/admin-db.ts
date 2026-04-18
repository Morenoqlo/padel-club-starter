/**
 * Admin DB helper — client-side
 * Llama a /api/admin/crud usando la service role key (server-side)
 * para que las operaciones bypaseen RLS y persistan en Supabase real.
 */

async function request(method: string, body: object) {
  const res = await fetch("/api/admin/crud", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Error desconocido");
  return json;
}

export const adminDb = {
  /** Inserta una fila y devuelve el registro creado */
  async insert<T = Record<string, unknown>>(
    table: string,
    payload: object
  ): Promise<T> {
    const { data } = await request("POST", { table, payload });
    return data as T;
  },

  /** Actualiza una fila por id y devuelve el registro actualizado */
  async update<T = Record<string, unknown>>(
    table: string,
    id: string,
    payload: object
  ): Promise<T> {
    const { data } = await request("PUT", { table, id, payload });
    return data as T;
  },

  /** Elimina una fila por id */
  async delete(table: string, id: string): Promise<void> {
    await request("DELETE", { table, id });
  },
};

import type { SupabaseClient } from "@supabase/supabase-js";
import { findHgClientForSquareCustomer } from "@/lib/hg-rewards/credit-from-square-payment";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type SquareClientLink = {
  client_id: string;
  linked_square_id: boolean;
};

function uniqueIds(ids: Array<string | null | undefined>): string[] {
  return Array.from(new Set(ids.filter((id): id is string => Boolean(id))));
}

/**
 * Match Square day bookings to Hello Gorgeous clients.
 * Prefer clients.square_customer_id, then email / phone. When a phone or email
 * match has no Square id on file, write it so the next chart opens already linked.
 */
export async function attachHgClientsToSquareDayAppointments(
  appointments: Array<{
    id: string;
    customerId?: string | null;
    customer_id?: string | null;
    customerEmail?: string | null;
    customer_email?: string | null;
    customerPhone?: string | null;
    customer_phone?: string | null;
  }>,
  supabase?: SupabaseClient | null,
): Promise<Map<string, SquareClientLink>> {
  const out = new Map<string, SquareClientLink>();
  const typed = supabase ?? (await createServerSupabaseClient());
  const db = typed as unknown as SupabaseClient;
  if (!typed || appointments.length === 0) return out;

  const squareIds = uniqueIds(
    appointments.map((a) => a.customerId ?? a.customer_id ?? null),
  );

  const bySquareId = new Map<string, { id: string; square_customer_id: string | null }>();
  if (squareIds.length) {
    const { data } = await db
      .from("clients")
      .select("id, square_customer_id")
      .in("square_customer_id", squareIds);
    for (const row of data || []) {
      if (row.square_customer_id) {
        bySquareId.set(row.square_customer_id, {
          id: row.id,
          square_customer_id: row.square_customer_id,
        });
      }
    }
  }

  for (const visit of appointments) {
    const squareCustomerId = visit.customerId ?? visit.customer_id ?? null;
    const email = visit.customerEmail ?? visit.customer_email ?? null;
    const phone = visit.customerPhone ?? visit.customer_phone ?? null;

    const fromId = squareCustomerId ? bySquareId.get(squareCustomerId) : undefined;
    if (fromId) {
      out.set(visit.id, { client_id: fromId.id, linked_square_id: true });
      continue;
    }

    const matched = await findHgClientForSquareCustomer(db, {
      squareCustomerId,
      email,
      phone,
    });
    if (!matched) continue;

    let linked = Boolean(squareCustomerId && bySquareId.has(squareCustomerId));
    if (squareCustomerId && !linked) {
      const { error } = await db
        .from("clients")
        .update({ square_customer_id: squareCustomerId })
        .eq("id", matched.id)
        .is("square_customer_id", null);
      if (!error) {
        linked = true;
        bySquareId.set(squareCustomerId, {
          id: matched.id,
          square_customer_id: squareCustomerId,
        });
      }
    }

    out.set(visit.id, { client_id: matched.id, linked_square_id: linked });
  }

  return out;
}

// ============================================================
// SQUARE CUSTOMERS — Fetch customers from Square for clients list
// Env: SQUARE_ACCESS_TOKEN or SQUARE_TOKEN, optional SQUARE_ENVIRONMENT (production | sandbox)
// ============================================================

import { SquareClient, SquareEnvironment } from 'square';

function getSquareAccessToken(): string | null {
  const token =
    process.env.SQUARE_ACCESS_TOKEN ||
    process.env.SQUARE_TOKEN ||
    null;
  if (!token || token.includes('placeholder')) return null;
  return token;
}

function getSquareEnvironment(): string {
  const env = (process.env.SQUARE_ENVIRONMENT || 'production').toLowerCase();
  return env === 'sandbox' ? SquareEnvironment.Sandbox : SquareEnvironment.Production;
}

/** Returns a Square client when credentials are configured, else null. */
export function getSquareClient(): SquareClient | null {
  const token = getSquareAccessToken();
  if (!token) return null;
  try {
    return new SquareClient({
      token,
      environment: getSquareEnvironment(),
    });
  } catch {
    return null;
  }
}

/** Shape we use in admin clients list (matches Supabase client row). */
export interface ClientRow {
  id: string;
  user_id?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  last_visit?: string | null;
  total_spent: number;
  visit_count: number;
  source: string | null;
  square_customer_id?: string | null;
}

/**
 * Fetch customers from Square and map to our client shape.
 * Paginates with cursor; pass limit (max 100).
 */
export async function fetchSquareCustomers(options: {
  limit?: number;
  cursor?: string;
  search?: string;
}): Promise<{ clients: ClientRow[]; cursor?: string; total?: number }> {
  const client = getSquareClient();
  if (!client) return { clients: [] };

  const limit = Math.min(100, Math.max(1, options.limit ?? 100));
  try {
    const page = await client.customers.list({
      limit,
      cursor: options.cursor ?? undefined,
      count: true,
    });

    // SDK returns a Page: .data = items array, .response = raw API response
    const rawCustomers = Array.isArray((page as any).data) ? (page as any).data : [];
    const resp = (page as any).response ?? {};
    const cursor = resp.cursor ?? undefined;
    const total = resp.count ?? undefined;

    const clients: ClientRow[] = rawCustomers.map((c: any) => {
      const email = c.emailAddress ?? '';
      const phone = (c.phoneNumber ?? '').replace(/\D/g, '');
      const created = c.createdAt ?? new Date().toISOString();
      return {
        id: c.id,
        user_id: null,
        first_name: (c.givenName ?? '').trim() || '—',
        last_name: (c.familyName ?? '').trim() || '—',
        email: email.trim() || '',
        phone: phone || '',
        created_at: created,
        last_visit: null,
        total_spent: 0,
        visit_count: 0,
        source: 'square',
        square_customer_id: c.id,
      };
    });

    // Optional client-side search filter (Square API doesn't support search on list)
    let filtered = clients;
    if (options.search && options.search.trim()) {
      const q = options.search.trim().toLowerCase();
      filtered = clients.filter(
        (c) =>
          c.first_name.toLowerCase().includes(q) ||
          c.last_name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      );
    }

    return { clients: filtered, cursor, total };
  } catch (err) {
    console.error('Square customers fetch error:', err);
    return { clients: [] };
  }
}

/** Fetch all Square customers (paginate until no cursor). Used for merge/list. */
export async function fetchAllSquareCustomers(
  maxCount = 1000,
  search?: string
): Promise<ClientRow[]> {
  const all: ClientRow[] = [];
  let cursor: string | undefined;
  do {
    const { clients, cursor: nextCursor } = await fetchSquareCustomers({
      limit: 100,
      cursor,
      search,
    });
    all.push(...clients);
    cursor = nextCursor;
    if (all.length >= maxCount) break;
  } while (cursor);
  return all;
}

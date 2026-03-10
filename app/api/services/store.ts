// Shared in-memory store for services when Supabase is not used.
// Seeded from lib/default-services.ts; new services added via Admin are stored here too.
import { DEFAULT_SERVICES } from '@/lib/default-services';

export const serviceStore = new Map<string, Record<string, unknown>>();

const now = new Date().toISOString();
for (const s of DEFAULT_SERVICES) {
  serviceStore.set(s.id, {
    ...s,
    created_at: now,
    updated_at: now,
  } as Record<string, unknown>);
}

let idCounter = 1;
export function nextServiceId() {
  return `svc-${Date.now()}-${idCounter++}`;
}

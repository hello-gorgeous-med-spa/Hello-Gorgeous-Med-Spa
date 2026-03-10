// Shared in-memory store for services when Supabase is not used
export const serviceStore = new Map<string, Record<string, unknown>>();
let idCounter = 1;
export function nextServiceId() {
  return `svc-${Date.now()}-${idCounter++}`;
}

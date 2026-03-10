export const membershipStore = new Map<string, Record<string, unknown>>();
let idCounter = 1;
export function nextMembershipId() {
  return `mem-${Date.now()}-${idCounter++}`;
}

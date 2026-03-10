export const sessionStore = new Map<string, Record<string, unknown>>();
let idCounter = 1;
export function nextSessionId() {
  return `ctc-${Date.now()}-${idCounter++}`;
}

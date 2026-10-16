import RunwayML from "@runwayml/sdk";

/** Returns null when the server has no Runway key. Server-only — do not import from client components. */
export function createRunwayClient(): RunwayML | null {
  const apiKey = process.env.RUNWAYML_API_SECRET;
  if (!apiKey) return null;
  return new RunwayML({ apiKey });
}

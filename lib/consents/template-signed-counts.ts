/** Normalize a consent title for matching kiosk packets to admin templates. */
export function consentNameKey(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const ALIASES: Record<string, string[]> = {
  "hipaa acknowledgment": ["hipaa privacy authorization"],
  "hipaa privacy authorization": ["hipaa acknowledgment"],
  "general treatment consent": ["general consent for treatment"],
  "general consent for treatment": ["general treatment consent"],
  "neurotoxin treatment consent": ["injectable treatment consent"],
  "injectable treatment consent": ["neurotoxin treatment consent"],
  "photo release": ["photo media release", "photo and media release"],
  "photo and media release": ["photo release"],
};

export function consentNamesMatch(a: string, b: string): boolean {
  const ka = consentNameKey(a);
  const kb = consentNameKey(b);
  if (!ka || !kb) return false;
  if (ka === kb) return true;
  return (ALIASES[ka] || []).some((alias) => consentNameKey(alias) === kb);
}

export type PacketSignedRow = {
  template_id?: string | null;
  template_name?: string | null;
};

export function signedCountForTemplate(
  packets: PacketSignedRow[],
  template: { id?: string | null; name: string },
): number {
  return packets.filter((p) => {
    if (template.id && p.template_id && p.template_id === template.id) return true;
    return consentNamesMatch(p.template_name || "", template.name);
  }).length;
}

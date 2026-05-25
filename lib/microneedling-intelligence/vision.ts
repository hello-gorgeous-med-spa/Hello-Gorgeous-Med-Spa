import type { MicroneedlingConcern, SkinUndertone, FitzpatrickType } from "@/data/microneedling-intelligence";

export type VisionAnalysis = {
  suggested_concerns: MicroneedlingConcern[];
  suggested_fitzpatrick?: FitzpatrickType;
  suggested_undertone?: SkinUndertone;
  observations: string[];
  confidence: "low" | "medium" | "high";
};

const VALID_CONCERNS = new Set<MicroneedlingConcern>([
  "acne_scars",
  "texture",
  "pores",
  "fine_lines",
  "pigmentation",
  "laxity",
  "stretch_marks",
  "dullness",
  "oiliness",
]);

const SYSTEM = `You are a clinical aesthetics assistant for Hello Gorgeous Med Spa microneedling consultations.
Analyze the skin photo for visible concerns ONLY. Do not diagnose medical conditions.
Output JSON only with keys:
- suggested_concerns: array of zero or more from: acne_scars, texture, pores, fine_lines, pigmentation, laxity, stretch_marks, dullness, oiliness
- suggested_fitzpatrick: one of I, II, III, IV, V, VI or null if unclear
- suggested_undertone: one of cool, neutral, warm, olive or null if unclear
- observations: array of 2-5 short provider-facing bullet strings (visible findings only)
- confidence: low, medium, or high
Be conservative. If photo quality is poor, return low confidence and empty concerns.`;

export async function analyzeMicroneedlingPhoto(imageBase64: string): Promise<VisionAnalysis | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_VISION_MODEL || "gpt-4o-mini";
  const dataUrl = imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this photo for microneedling consultation planning." },
            { type: "image_url", image_url: { url: dataUrl, detail: "low" } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
      max_tokens: 600,
    }),
  });

  if (!res.ok) {
    console.error("microneedling vision error", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    const parsed = JSON.parse(content) as VisionAnalysis;
    parsed.suggested_concerns = (parsed.suggested_concerns || []).filter((c) =>
      VALID_CONCERNS.has(c as MicroneedlingConcern),
    ) as MicroneedlingConcern[];
    parsed.observations = Array.isArray(parsed.observations) ? parsed.observations.slice(0, 6) : [];
    if (!["low", "medium", "high"].includes(parsed.confidence)) parsed.confidence = "low";
    return parsed;
  } catch {
    return null;
  }
}

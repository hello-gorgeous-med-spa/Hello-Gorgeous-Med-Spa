import OpenAI from "openai";

let client: OpenAI | null = null;

/** Lazy OpenAI client — avoids build-time failures when API keys are unset (e.g. CI). */
export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPEN_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new OpenAI({ apiKey });
  return client;
}

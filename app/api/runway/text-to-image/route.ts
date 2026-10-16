/**
 * POST /api/runway/text-to-image
 * Owner-only. Starts a gen4_image task and waits for the output URL.
 */
import { NextRequest, NextResponse } from "next/server";
import {
  AbortError,
  AuthenticationError,
  BadRequestError,
  RateLimitError,
  TaskFailedError,
  TaskTimedOutError,
} from "@runwayml/sdk";
import { getOwnerSession } from "@/lib/get-owner-session";
import { isGen4ImageRatio } from "@/lib/runway-image";
import { createRunwayClient } from "@/lib/runway";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const PROMPT_MAX = 1000;

export async function POST(request: NextRequest) {
  const session = await getOwnerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = createRunwayClient();
  if (!client) {
    return NextResponse.json({ error: "Runway is not configured on the server." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const promptText = typeof record.promptText === "string" ? record.promptText.trim() : "";
  const ratio = typeof record.ratio === "string" ? record.ratio : "1080:1080";

  if (!promptText || promptText.length > PROMPT_MAX) {
    return NextResponse.json(
      { error: `Prompt must be 1–${PROMPT_MAX} characters.` },
      { status: 400 },
    );
  }
  if (!isGen4ImageRatio(ratio)) {
    return NextResponse.json({ error: "Unsupported image ratio." }, { status: 400 });
  }

  try {
    const task = await client.textToImage
      .create({
        model: "gen4_image",
        promptText,
        ratio,
      })
      .waitForTaskOutput({
        abortSignal: request.signal,
        timeout: 240_000,
      });

    return NextResponse.json({
      id: task.id,
      output: task.output,
    });
  } catch (error) {
    if (error instanceof TaskFailedError) {
      const details = error.taskDetails;
      if (details.status === "FAILED") {
        return NextResponse.json(
          { error: details.failure, failureCode: details.failureCode, id: details.id },
          { status: 422 },
        );
      }
      return NextResponse.json(
        { error: "Generation was cancelled.", id: details.id },
        { status: 422 },
      );
    }
    if (error instanceof TaskTimedOutError) {
      return NextResponse.json({ error: "Generation timed out. Try again." }, { status: 504 });
    }
    if (error instanceof AbortError) {
      return NextResponse.json({ error: "Generation was cancelled." }, { status: 499 });
    }
    if (error instanceof RateLimitError) {
      const retryAfter = error.headers.get("retry-after");
      return NextResponse.json(
        { error: "Runway rate limit. Wait and try again." },
        {
          status: 429,
          headers: retryAfter ? { "Retry-After": retryAfter } : undefined,
        },
      );
    }
    if (error instanceof BadRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof AuthenticationError) {
      return NextResponse.json({ error: "Runway rejected the server API key." }, { status: 503 });
    }
    console.error("runway text-to-image", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Generation failed." }, { status: 502 });
  }
}

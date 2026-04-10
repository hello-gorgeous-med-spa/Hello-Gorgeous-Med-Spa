import { NextRequest, NextResponse } from "next/server";
import { CountryCode, Products } from "plaid";
import { requireHubSessionOrOpen } from "@/lib/hub-api-auth";
import { getPlaidClient } from "@/lib/plaid/client";

export async function POST(req: NextRequest) {
  const auth = await requireHubSessionOrOpen(req);
  if (auth instanceof NextResponse) return auth;

  const plaid = getPlaidClient();
  if (!plaid) {
    return NextResponse.json(
      { error: "Plaid not configured (PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV)" },
      { status: 503 }
    );
  }

  let body: { client_user_id?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body */
  }

  const clientUserId = (body.client_user_id || "hg-hub").slice(0, 200);

  try {
    const res = await plaid.linkTokenCreate({
      client_name: "Hello Gorgeous Hub",
      language: "en",
      country_codes: [CountryCode.Us],
      user: { client_user_id: clientUserId },
      products: [Products.Transactions],
    });

    return NextResponse.json({ link_token: res.data.link_token, expiration: res.data.expiration });
  } catch (e: unknown) {
    const msg = e && typeof e === "object" && "response" in e
      ? String((e as { response?: { data?: { error_message?: string } } }).response?.data?.error_message)
      : e instanceof Error
        ? e.message
        : "linkTokenCreate failed";
    console.error("[plaid/link-token]", e);
    return NextResponse.json({ error: msg || "linkTokenCreate failed" }, { status: 502 });
  }
}

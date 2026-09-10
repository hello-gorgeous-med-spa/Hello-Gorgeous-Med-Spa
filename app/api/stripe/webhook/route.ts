/**
 * Compatibility endpoint for the Hello Gorgeous Med Spa RX Stripe account.
 * Dashboard still posts to /api/stripe/webhook on hellogorgeousmedspa.com.
 * Same handler as tryregenrx.com/api/regen/webhooks/stripe.
 */
export { GET, POST } from "@/app/api/regen/webhooks/stripe/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextRequest, NextResponse } from "next/server";

import { createRegenCheckout, createRegenQuickPay, type RegenCartItem } from "@/lib/regen/checkout";
import { validateCartPricing } from "@/lib/regen/pricing-sync";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { SITE } from "@/lib/seo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutRequestBody = {
  items?: RegenCartItem[];
  quickPay?: {
    productId: string;
    name: string;
    priceUsd: number;
  };
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  goal?: string;
  allergies?: string;
  supplyMonths?: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;
    
    console.log("[regen/checkout] Request received:", {
      hasItems: !!body.items?.length,
      itemCount: body.items?.length || 0,
      hasQuickPay: !!body.quickPay,
      hasEmail: !!body.customerEmail,
      goal: body.goal,
    });

    const redirectUrl = `${SITE.url}/rx/checkout/success`;

    // Quick pay for single product
    if (body.quickPay) {
      const result = await createRegenQuickPay({
        productId: body.quickPay.productId,
        name: body.quickPay.name,
        priceUsd: body.quickPay.priceUsd,
        redirectUrl,
      });

      return NextResponse.json({
        success: true,
        checkoutUrl: result.url,
        orderId: result.orderId,
      });
    }

    // Full cart checkout
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Cart is empty" },
        { status: 400 },
      );
    }

    // Validate and potentially adjust prices against canonical pricing
    const cartItems = body.items.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.priceUsd,
      quantity: item.quantity,
    }));
    const validation = validateCartPricing(cartItems);
    
    // Log warnings but proceed with validated prices
    if (validation.warnings.length > 0) {
      console.warn("[regen/checkout] Price validation warnings:", validation.warnings);
    }

    // Use validated items (prices adjusted to canonical if needed)
    const validatedItems: RegenCartItem[] = validation.items.map((item, i) => ({
      id: body.items![i].id,
      name: body.items![i].name,
      priceUsd: item.price,
      quantity: item.quantity,
      category: body.goal || "general",
      rx: true,
    }));

    // Store the order in database BEFORE payment (pay-first model)
    const orderRef = `RG-${Date.now().toString(36).toUpperCase()}`;
    const supplyLabel = body.supplyMonths === 3 ? "90-day" : "30-day";
    const subtotalUsd = validation.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const admin = getSupabaseAdminClient();
    if (admin) {
      const { error: dbError } = await admin.from("regen_orders").insert({
        reference: orderRef,
        customer_name: body.customerName || null,
        customer_email: body.customerEmail || null,
        customer_phone: body.customerPhone || null,
        goal: body.goal || null,
        allergies: body.allergies || "None",
        supply_cycle: supplyLabel,
        items: validatedItems,
        subtotal_usd: subtotalUsd,
        shipping_usd: 30,
        status: "pending_payment",
        created_at: new Date().toISOString(),
      });
      if (dbError) {
        console.error("[regen/checkout] DB error:", dbError);
      }
    } else {
      console.error("[regen/checkout] Supabase admin unavailable — order not persisted before checkout");
    }

    const result = await createRegenCheckout({
      items: validatedItems,
      customerEmail: body.customerEmail,
      redirectUrl: `${redirectUrl}?ref=${orderRef}`,
      orderReference: orderRef,
    });

    // Link Square order for webhook + payment verification after checkout
    if (admin && result.orderId) {
      const { error: linkErr } = await admin
        .from("regen_orders")
        .update({
          square_order_id: result.orderId,
          square_payment_link_id: result.paymentLinkId ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq("reference", orderRef);
      if (linkErr) {
        console.error("[regen/checkout] square_order_id link failed:", linkErr);
      }
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: result.url,
      orderId: result.orderId,
      orderReference: orderRef,
    });
  } catch (err) {
    console.error("[regen/checkout] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Checkout failed",
      },
      { status: 500 },
    );
  }
}

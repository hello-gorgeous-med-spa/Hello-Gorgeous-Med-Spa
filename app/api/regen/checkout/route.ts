import { NextRequest, NextResponse } from "next/server";

import { createRegenCheckout, createRegenQuickPay, type RegenCartItem } from "@/lib/regen/checkout";
import { validateCartPricing } from "@/lib/regen/pricing-sync";
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
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutRequestBody;

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
      ...body.items![i],
      priceUsd: item.price,
    }));

    const result = await createRegenCheckout({
      items: validatedItems,
      customerEmail: body.customerEmail,
      redirectUrl,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: result.url,
      orderId: result.orderId,
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

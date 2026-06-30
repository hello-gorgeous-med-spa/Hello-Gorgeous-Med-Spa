import { NextRequest, NextResponse } from "next/server";

import { buildCartIntakeUrl, buildIntakeUrl, getProductIntakeRoute } from "@/lib/regen/intake-router";

export const runtime = "nodejs";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type IntakeRouteRequest = {
  // Single product
  productId?: string;
  productName?: string;
  price?: number;
  quantity?: number;
  // Or cart of items
  items?: CartItem[];
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IntakeRouteRequest;

    // Cart checkout - multiple items
    if (body.items && body.items.length > 0) {
      const intakeUrl = buildCartIntakeUrl(body.items);
      const route = getProductIntakeRoute(body.items[0].id);
      
      return NextResponse.json({
        success: true,
        intakeUrl,
        intakeType: route.intakeType,
        requiresIntake: route.requiresIntake,
        description: route.description,
      });
    }

    // Single product
    if (body.productId) {
      const intakeUrl = buildIntakeUrl(body.productId, {
        productName: body.productName,
        price: body.price,
        quantity: body.quantity,
      });
      const route = getProductIntakeRoute(body.productId);
      
      return NextResponse.json({
        success: true,
        intakeUrl,
        intakeType: route.intakeType,
        requiresIntake: route.requiresIntake,
        description: route.description,
      });
    }

    return NextResponse.json(
      { success: false, error: "No product or cart items provided" },
      { status: 400 }
    );
  } catch (err) {
    console.error("[regen/intake-route] Error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to determine intake route" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { backendRequest, extractBearerToken } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";

interface CartItemData {
  item: {
    id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const body = await request.json();
    const result = await backendRequest<CartItemData>("/cart/items", {
      method: "POST",
      token,
      body,
    });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

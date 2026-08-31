import { NextRequest, NextResponse } from "next/server";
import { backendRequest, backendRequestMessage, extractBearerToken } from "@/lib/api/backend-client";
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ product: string }> }
) {
  try {
    const { product } = await params;
    const token = extractBearerToken(request);
    const body = await request.json();
    const result = await backendRequest<CartItemData>(`/cart/items/${encodeURIComponent(product)}`, {
      method: "PUT",
      token,
      body,
    });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ product: string }> }
) {
  try {
    const { product } = await params;
    const token = extractBearerToken(request);
    const result = await backendRequestMessage(`/cart/items/${encodeURIComponent(product)}`, {
      method: "DELETE",
      token,
    });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

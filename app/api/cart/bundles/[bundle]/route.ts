import { NextRequest, NextResponse } from "next/server";
import { backendRequest, backendRequestMessage, extractBearerToken } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";
import type { CartItemData } from "@/services/cart/cart.interface";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ bundle: string }> }
) {
  try {
    const { bundle } = await params;
    const token = extractBearerToken(request);
    const body = await request.json();
    const result = await backendRequest<CartItemData>(`/cart/bundles/${encodeURIComponent(bundle)}`, {
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
  { params }: { params: Promise<{ bundle: string }> }
) {
  try {
    const { bundle } = await params;
    const token = extractBearerToken(request);
    const result = await backendRequestMessage(`/cart/bundles/${encodeURIComponent(bundle)}`, {
      method: "DELETE",
      token,
    });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

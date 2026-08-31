import { NextRequest, NextResponse } from "next/server";
import { backendRequest, backendRequestMessage, extractBearerToken } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";

interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  discount_percentage: number;
  final_price: number;
  stock_quantity: number;
  stock_availability: string;
  primary_image: { id: number; image_path: string | null; is_primary: boolean } | null;
}

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product: CartProduct;
}

interface CartData {
  cart: {
    id: number;
    items: CartItem[];
    total: number;
    item_count: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const result = await backendRequest<CartData>("/cart", { token });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const result = await backendRequestMessage("/cart", { method: "DELETE", token });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { backendRequest, extractBearerToken } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";

interface CheckoutOrderItem {
  id: number;
  type?: "product" | "bundle";
  product_id: number | null;
  bundle_id?: number | null;
  product_name?: string;
  name?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  bundle_price?: number;
  components?: { product_id: number; name: string; quantity: number; unit_price: number }[];
  is_request_only?: boolean;
}

interface CheckoutData {
  order: {
    id: number;
    order_number: string;
    status: string;
    total: number;
    shipping_cost: number;
    tax: number;
    discount: number;
    shipping_name: string;
    shipping_phone: string;
    shipping_city: string;
    shipping_area: string;
    shipping_building_street: string | null;
    shipping_appartment_number: string | null;
    items: CheckoutOrderItem[];
    created_at: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const body = await request.json();
    const result = await backendRequest<CheckoutData>("/checkout", {
      method: "POST",
      token,
      body,
    });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { backendRequest, extractBearerToken } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";

interface CheckoutOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
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

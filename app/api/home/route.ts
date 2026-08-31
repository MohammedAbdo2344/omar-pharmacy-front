import { NextRequest, NextResponse } from "next/server";
import { backendRequest, extractBearerToken } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";

interface HomeCategory {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  color: string | null;
  products_count: number;
}

interface HomeProduct {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  tablet_count: string | null;
  price: string;
  stock_quantity: number;
  primary_image: PrimaryImage | null;
  active_discount: ActiveDiscount | null;
  flag: "best_seller" | "popular" | "high_offer";
  color: string | null;
}

interface ActiveDiscount {
  id: number;
  product_id: number;
  type: string;
  value: string;
  ends_at: string;
  max_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PrimaryImage {
  id: number;
  product_id: number;
  image: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

interface HomeData {
  categories: HomeCategory[];
  products: HomeProduct[];
}

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const result = await backendRequest<HomeData>("/home", { token });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

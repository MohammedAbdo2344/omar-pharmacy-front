import { NextRequest, NextResponse } from "next/server";
import { backendRequest, extractBearerToken, extractLocale } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";

interface HomeCategory {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  color: string | null;
  products_count: number;
}

interface HomeProduct {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  tablet_count?: string | null;
  price: number;
  discount_percentage: number;
  final_price: number;
  stock_quantity: number;
  primary_image: PrimaryImage | null;
  flag: "best_seller" | "popular" | "high_offer";
  color: string | null;
}

interface PrimaryImage {
  id: number;
  image_url: string;
  is_primary: boolean;
}

interface HomeData {
  categories: HomeCategory[];
  products: HomeProduct[];
}

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const result = await backendRequest<HomeData>("/home", { token, locale: extractLocale(request) });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

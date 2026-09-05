import { NextRequest, NextResponse } from "next/server";
import { backendRequest, extractBearerToken, extractLocale } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";

interface ProductPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface ProductListData {
  products: Record<string, unknown>[];
  pagination: ProductPagination;
}

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const searchParams = request.nextUrl.searchParams;

    const result = await backendRequest<ProductListData>("/products", {
      token,
      locale: extractLocale(request),
      query: {
        category_id: searchParams.get("category_id") ?? undefined,
        min_price: searchParams.get("min_price") ?? undefined,
        max_price: searchParams.get("max_price") ?? undefined,
        sort_by_price: searchParams.get("sort_by_price") ?? undefined,
        search: searchParams.get("search") ?? undefined,
        per_page: searchParams.get("per_page") ?? undefined,
        page: searchParams.get("page") ?? undefined,
      },
    });

    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

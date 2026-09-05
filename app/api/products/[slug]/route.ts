import { NextRequest, NextResponse } from "next/server";
import { backendRequest, extractBearerToken, extractLocale } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";

interface ProductDetailData {
  product: Record<string, unknown>;
  related_products: Record<string, unknown>[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = extractBearerToken(request);
    const result = await backendRequest<ProductDetailData>(`/products/${encodeURIComponent(slug)}`, {
      token,
      locale: extractLocale(request),
    });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

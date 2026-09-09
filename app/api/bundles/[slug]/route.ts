import { NextRequest, NextResponse } from "next/server";
import { backendRequest, extractBearerToken, extractLocale } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";
import type { BundleDetailData } from "@/services/bundles/bundles.interface";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = extractBearerToken(request);
    const result = await backendRequest<BundleDetailData>(`/bundles/${encodeURIComponent(slug)}`, {
      token,
      locale: extractLocale(request),
    });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

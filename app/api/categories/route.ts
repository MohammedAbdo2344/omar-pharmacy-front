import { NextRequest, NextResponse } from "next/server";
import { backendRequest, extractBearerToken, extractLocale } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";

interface CategoryRecord {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: number | null;
  is_active: boolean;
  sort_order: number;
  color: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const result = await backendRequest<CategoryRecord[]>("/categories", { token, locale: extractLocale(request) });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { backendRequest, extractBearerToken, extractLocale } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";

interface ConfigData {
  name: string | null;
  logo: string | null;
  favicon: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  working_hours: string | null;
  instagram: string | null;
  facebook: string | null;
  x: string | null;
  currency: string | null;
  google_maps_url: string | null;
  payment_cod_enabled: string | null;
  payment_instapay_enabled: string | null;
  payment_instapay_number: string | null;
  payment_instapay_name: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const result = await backendRequest<ConfigData>("/config", { token, locale: extractLocale(request) });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

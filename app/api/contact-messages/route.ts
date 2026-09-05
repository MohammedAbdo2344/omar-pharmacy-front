import { NextRequest, NextResponse } from "next/server";
import { backendRequestMessage, extractBearerToken } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";

export async function POST(request: NextRequest) {
  try {
    const token = extractBearerToken(request);
    const body = await request.json();
    const result = await backendRequestMessage("/contact-messages", {
      method: "POST",
      token,
      body,
    });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

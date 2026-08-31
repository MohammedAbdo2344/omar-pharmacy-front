import { NextResponse } from "next/server";
import { backendRequest } from "@/lib/api/backend-client";
import { handleRouteError } from "@/lib/api/route-helpers";

interface SessionData {
  token: string;
  expires_at: string;
}

export async function POST() {
  try {
    const result = await backendRequest<SessionData>("/session", { method: "POST" });
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return handleRouteError(error);
  }
}

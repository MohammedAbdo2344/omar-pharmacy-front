import { NextResponse } from "next/server";
import { BackendApiError } from "./errors";

/** Mirrors a backend error (status + body) back to the client unchanged. */
export function handleRouteError(error: unknown): NextResponse {
  if (error instanceof BackendApiError) {
    return NextResponse.json(error.envelope, { status: error.status });
  }

  if (error instanceof Error && error.message.includes("NEXT_PUBLIC_API_URL")) {
    return NextResponse.json(
      { message: "Server misconfiguration: API base URL is not set" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Unexpected error contacting backend" },
    { status: 500 }
  );
}

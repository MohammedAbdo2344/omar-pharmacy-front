import { BackendApiError } from "./errors";
import type { ApiDataEnvelope, ApiErrorEnvelope } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
const DEFAULT_LOCALE: SupportedLocale = "en";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface BackendRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
  /** Bearer token forwarded from the client's `Authorization` header. */
  token?: string | null;
  /** Current route locale (`en`/`ar`), sent to Laravel as the `Locale` header. */
  locale?: string | null;
}

function resolveLocale(locale?: string | null): SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(locale ?? "")
    ? (locale as SupportedLocale)
    : DEFAULT_LOCALE;
}

/** Extracts the `Locale` header from an incoming Next.js request, validated against SUPPORTED_LOCALES. */
export function extractLocale(request: Request): SupportedLocale {
  return resolveLocale(request.headers.get("locale"));
}

function buildUrl(path: string, query?: BackendRequestOptions["query"]): string {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined in the environment");
  }

  const url = new URL(`${API_BASE_URL.replace(/\/$/, "")}${path}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * Calls the Laravel backend and returns the parsed `data` payload from a
 * Shape A (`ResponsesHelper::returnData`) response, throwing `BackendApiError`
 * for every other shape documented in API_INTEGRATION_REFERENCE.md §4.
 */
export async function backendRequest<T>(
  path: string,
  options: BackendRequestOptions = {}
): Promise<ApiDataEnvelope<T>> {
  const { method = "GET", body, query, token, locale } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    Locale: resolveLocale(locale),
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await response.json().catch(() => ({})) as Record<string, unknown>;

  if (!response.ok) {
    throw new BackendApiError(response.status, json as unknown as ApiErrorEnvelope);
  }

  return json as unknown as ApiDataEnvelope<T>;
}

/**
 * Calls the Laravel backend for endpoints whose success response has no
 * `data`/`header` keys (Shape B — `ResponsesHelper::returnSuccessMessage`).
 */
export async function backendRequestMessage(
  path: string,
  options: BackendRequestOptions = {}
): Promise<{ code: number; message: string; success: boolean; status: number }> {
  const { method = "GET", body, query, token, locale } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    Locale: resolveLocale(locale),
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await response.json().catch(() => ({})) as Record<string, unknown>;

  if (!response.ok) {
    throw new BackendApiError(response.status, json as unknown as ApiErrorEnvelope);
  }

  return json as { code: number; message: string; success: boolean; status: number };
}

/** Extracts a Bearer token from an incoming Next.js request's Authorization header. */
export function extractBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }
  return header.slice("Bearer ".length);
}

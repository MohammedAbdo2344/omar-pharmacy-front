import { BackendApiError } from "@/lib/api/errors";
import type { ApiDataEnvelope, ApiErrorEnvelope } from "@/lib/api/types";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const SUPPORTED_LOCALES = ["en", "ar"] as const;
const DEFAULT_LOCALE = "en";

interface ServiceRequestOptions {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
  /** Guest session token, sent as `Authorization: Bearer <token>` to our /app/api layer. */
  token?: string | null;
  /** Overrides the auto-detected route locale. Usually left unset — the current `/[locale]/...` segment is used. */
  locale?: string | null;
}

/** Reads the current locale from the `/[locale]/...` URL segment so callers never have to pass it manually. */
function getCurrentLocale(): string {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }
  const segment = window.location.pathname.split("/")[1];
  return (SUPPORTED_LOCALES as readonly string[]).includes(segment) ? segment : DEFAULT_LOCALE;
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
}

function buildUrl(path: string, query?: ServiceRequestOptions["query"]): string {
  const url = new URL(path, getBaseUrl());

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/** Calls our own `/app/api` layer and returns the `data` payload of a Shape A response. */
export async function serviceRequest<T>(
  path: string,
  options: ServiceRequestOptions = {}
): Promise<T> {
  const { method = "GET", body, query, token, locale } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    Locale: locale ?? getCurrentLocale(),
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

  const json = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    throw new BackendApiError(response.status, json as unknown as ApiErrorEnvelope);
  }

  return (json as unknown as ApiDataEnvelope<T>).data;
}

/** Calls our own `/app/api` layer for endpoints whose success response has no `data` key. */
export async function serviceRequestMessage(
  path: string,
  options: ServiceRequestOptions = {}
): Promise<{ code: number; message: string; success: boolean; status: number }> {
  const { method = "GET", body, query, token, locale } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    Locale: locale ?? getCurrentLocale(),
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

  const json = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    throw new BackendApiError(response.status, json as unknown as ApiErrorEnvelope);
  }

  return json as { code: number; message: string; success: boolean; status: number };
}

const API_BASE_URL = "http://localhost:8000/api/v1";

/** Origin of the backend, e.g. "http://localhost:8000" from "http://localhost:8000/api/v1". */
const API_ORIGIN = new URL(API_BASE_URL).origin;

/** Resolves a storage-relative path (e.g. "products/foo.webp") to a full backend asset URL. */
export function resolveAssetUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}/storage/${path.replace(/^\/?storage\//, "")}`;
}

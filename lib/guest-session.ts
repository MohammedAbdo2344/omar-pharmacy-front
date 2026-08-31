export const GUEST_SESSION_COOKIE = "guest_token";

/** Reads the guest-session token set by middleware, for use in client components. */
export function getGuestTokenClient(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${GUEST_SESSION_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

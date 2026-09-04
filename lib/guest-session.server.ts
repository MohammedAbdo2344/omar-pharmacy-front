import { cookies } from "next/headers";
import { GUEST_SESSION_COOKIE } from "./guest-session";

/** Reads the guest-session token set by middleware, for use in Server Components. */
export async function getGuestTokenServer(): Promise<string | null> {
  const store = await cookies();
  return store.get(GUEST_SESSION_COOKIE)?.value ?? null;
}

import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { GUEST_SESSION_COOKIE } from '@/lib/guest-session';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ar'],

  // Used when no locale matches
  defaultLocale: 'en'
});

const API_BASE_URL = 'https://dromarpharmacy-production.up.railway.app/api/v1';

export default async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  if (!request.cookies.get(GUEST_SESSION_COOKIE) && API_BASE_URL) {
    try {
      const backendResponse = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/session`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });

      if (backendResponse.ok) {
        const json = await backendResponse.json();
        const token: string | undefined = json?.data?.token;
        const expiresAt: string | undefined = json?.data?.expires_at;

        if (token) {
          response.cookies.set(GUEST_SESSION_COOKIE, token, {
            path: '/',
            sameSite: 'lax',
            expires: expiresAt ? new Date(expiresAt) : undefined,
          });
        }
      }
    } catch {
      // Backend unreachable — proceed without a guest session; pages fetching
      // session-protected data will handle the missing token gracefully.
    }
  }

  return response;
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};

# Deploying to Vercel

## 1. Import the project
- In Vercel, "Add New → Project" and import this Git repo.
- Framework preset is auto-detected as **Next.js**. No overrides needed:
  - Build command: `next build`
  - Install command: `npm install`
  - Output: handled by Next.js

## 2. Environment variables
Set these in Vercel → Project → Settings → Environment Variables
(Production + Preview). See `.env.example`.

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | yes | Backend API base URL including `/api/v1`, e.g. `https://api.example.com/api/v1` |
| `NEXT_PUBLIC_SITE_URL` | recommended | Public origin of the deployment, e.g. `https://pharmacy.example.com`. If unset, server-side calls fall back to `VERCEL_URL` (auto-provided). |

## 3. Node version
`.nvmrc` pins Node 22, matching Vercel's default runtime.

## 4. Notes
- `proxy.ts` (formerly `middleware.ts`) runs on every non-asset request and
  provisions a guest-session cookie from `${NEXT_PUBLIC_API_URL}/session`. If the
  backend is unreachable it fails open.
- `next build` does not run ESLint. `npm run lint` currently reports errors
  (mostly `<a>` vs `next/link`) — worth fixing but they do not block deploys.
- Remote images are rendered with plain `<img>`, so no `next.config.ts`
  `images.remotePatterns` entry is required.

# Livio Beta upgrade handoff

## Completed

- Preserved the existing public Livio landing page and Lovable/TanStack structure.
- Added the missing authenticated student routes: Home, AI Advisor, Explore, Compare, My Journey, Documents, Profile, Notifications, and Settings.
- Replaced the five-item mobile navigation with the requested three-item model: Home, AI Advisor, and My Journey.
- Added profile-based university ranking, search, country filtering, shortlist saving, and a three-university comparison view.
- Added university detail pages and a working application-start flow that writes to Supabase and routes students into My Journey.
- Added application journey cards, status timelines, notifications, and sign-out.
- Added private PDF/JPG/PNG document upload, signed download, deletion, application linking, size/type validation, and a Storage bucket migration.
- Added an AI Advisor UI backed by a protected server function. It uses a configured Lovable AI Gateway key when available and otherwise gives profile/catalogue/application-aware local guidance instead of failing.
- Installed the supplied Livio Venture logo across the landing page, authentication, onboarding, and app shell.
- Added `.env.example`; the real `.env` is excluded from the delivery archive.

## Verification

- `pnpm exec tsc --noEmit` passed.
- `pnpm run lint` passed with six existing Fast Refresh warnings and no errors.
- `pnpm run build` passed for the client, SSR, and Cloudflare/Nitro output.
- Browser verification confirmed the public landing page and branded sign-in page render, and `/app` redirects unauthenticated users to `/auth`.

## Requires external configuration or further work

- The configured Supabase endpoint is reachable, but migrations must be applied to the intended Supabase project before authenticated application/upload flows can be tested end to end.
- Google OAuth must be enabled in Supabase and configured with the production callback URL before it can work outside the existing environment.
- The supplied `AQ...` model token was rejected by the Lovable AI Gateway (HTTP 401) and was not stored. Add a valid `LOVABLE_API_KEY` as a server secret for hosted-model responses; contextual local advisor responses remain available without it.
- No test login was supplied, so signed-in browser transactions were compiled and reviewed but not executed against a real user account.
- Counsellor, Admin, and Super Admin dashboards remain a later delivery phase.
- Marketing-page statistics, testimonials, discounts, and partner claims remain unverified and should be replaced or approved by the client.

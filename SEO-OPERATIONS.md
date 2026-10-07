# SEO / GEO operations (Studio Dentistico Marostica)

Site code prerenders Italian (`/`) and English (`/en/`) HTML. This file is the clinic-side checklist that cannot be finished in Git.

## Hosting

1. In Vercel, set the canonical host to `www.studiodentisticomarostica.com`.
2. Create a Deploy Hook and set `VERCEL_DEPLOY_HOOK_URL` on the `admin-api` Edge Function and on the Vercel project (used by `/api/cron-rebuild` at 03:00 UTC).
3. Optional: `CRON_SECRET` (Authorization: `Bearer …`) and `INDEXNOW_KEY` plus a `public/{key}.txt` file for IndexNow.
4. Redeploy `admin-api` after env changes.

NAP to use everywhere:

**Studio Dentistico Marostica — Via XXIV Maggio 39, 36063 Marostica (VI)**  
Tel. +39 351 8228984 · +39 0424 73061 ·  info@studiodentisticomarostica.it

## Search consoles

- Google Search Console: verify the domain (DNS), submit `https://www.studiodentisticomarostica.com/sitemap.xml`.
- Bing Webmaster Tools: same sitemap (also feeds Copilot).
- After publish, IndexNow pings if `INDEXNOW_KEY` is set.

## Google Business Profile

- Claim/verify, category Dentist, hours matching the site (Mon–Fri 09:00–19:00, Sat 09:00–13:00).
- Photos: clinic, team, `public/images/about/about-us.jpg`.
- Appointment URL: `https://www.studiodentisticomarostica.com/contact?utm_source=gbp`.
- Replace the Maps embed with the official Place ID iframe when available (coordinates currently approximate: 45.74611, 11.65556).

## Citations (same NAP)

Bing Places, Apple Business Connect, Pagine Gialle/Bianche, Facebook, Instagram, Doctoralia/MioDottore, Yelp, Tuttocittà, OpenStreetMap, ANDI/OMCeO if applicable. Local: Comune di Marostica, Pro Loco, press.

## Reviews

After the in-site token review, patients see a Google review CTA. Add a reception QR to the GBP review link. Reply to every review.

## Analytics

Event names (cookieless CustomEvent `sdm-analytics`): `phone_click`, `whatsapp_click`, `booking_submit`, `directions_click`, `google_review_click`, `ai_referrer`.

If `VITE_GA_MEASUREMENT_ID` is set, a consent banner loads gtag only after accept.

Monthly: segment referrers `chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`.

## Monthly AI prompt tests

Log whether the clinic is cited and what is said:

- miglior dentista a Marostica
- implantologia Marostica
- dentista vicino a Bassano del Grappa
- igiene dentale Marostica
- estrazione dente del giudizio Marostica

## First three blog posts (publish from admin)

Drafts are in `src/content/blogDrafts.ts`:

1. Quanto costano gli impianti dentali?
2. Ogni quanto fare l’igiene dentale professionale?
3. Estrazione del dente del giudizio

Each article: reviewed by Dr. Mourtada, visible date, sources (Ministero della Salute / ISS / ANDI). No superlatives, no promotional prices (Legge 145/2018). Doctor must approve copy.

## Inputs still needed from the clinic

Exact coordinates and Google Place ID, GBP access, OMCeO registration number, full social/directory URLs, confirmation of languages and of STATIC_REVIEWS authenticity.

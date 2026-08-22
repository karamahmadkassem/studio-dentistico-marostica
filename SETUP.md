# Studio Dentistico Marostica — Backend Setup

This site uses **Supabase** (PostgreSQL + Edge Functions + Storage) and **Brevo** for email.

## 1. Create Supabase project

1. Sign up at [supabase.com](https://supabase.com) and create a project.
2. Note your **Project URL** and **anon public** key (Settings → API).
3. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## 2. Run database migrations

Install the [Supabase CLI](https://supabase.com/docs/guides/cli), then from the project root:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Migrations live in `supabase/migrations/`:
- `001_initial_schema.sql` — tables, RLS, opening hours
- `002_seed_content.sql` — admin user, services, about, categories
- `003_seed_blog_reviews_storage.sql` — blog posts, reviews, storage bucket

**Default admin:** username `admin`, password `changeme` — change immediately after first login.

## 3. Deploy Edge Functions

Set secrets in Supabase Dashboard → Edge Functions → Secrets:

| Secret | Purpose |
|--------|---------|
| `SUPABASE_URL` | Same as project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (never in frontend) |
| `BREVO_API_KEY` | Brevo transactional email |
| `BREVO_FROM_EMAIL` | e.g. `info@studiodentisticomarostica.it` |
| `SITE_URL` | Production site URL |
| `ADMIN_NOTIFY_EMAIL` | Optional booking notifications |

Deploy functions:

```bash
supabase functions deploy admin-login
supabase functions deploy admin-me
supabase functions deploy get-availability
supabase functions deploy create-booking
supabase functions deploy admin-api
supabase functions deploy submit-review
supabase functions deploy subscribe-newsletter
```

## 4. Brevo (email)

1. Create a [Brevo](https://www.brevo.com) account.
2. Verify domain `studiodentisticomarostica.it` (SPF + DKIM).
3. Create an API key and add it as `BREVO_API_KEY`.

Emails sent:
- Booking “pending confirmation” to patient
- Admin notification on new booking (optional)
- Review invitation after accepted appointment
- Newsletter broadcast when publishing blog posts

## 5. Frontend deploy

```bash
npm install
npm run build
```

Deploy the `dist/` folder to **Netlify** or **Vercel**. Set the same `VITE_*` env vars in the host dashboard.

## 6. Admin panel

- URL: `/admin/login`
- After login: calendar (default), services, about, blog, reviews
- Excluded from sitemap; `robots.txt` disallows `/admin`

## 7. Local development

Without Supabase env vars, the public site uses static fallback content and mock appointment slots. With env vars set, booking and CMS data load from the API.

```bash
npm run dev
```

## Security notes

- Never commit `.env` or the service role key.
- All admin writes go through Edge Functions with session verification.
- RLS allows public **read** of published content only.
- Change the seeded admin password after first login.

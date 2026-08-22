# Deploy guide — Supabase Free + Netlify Free + GoDaddy domain

## Stack (all free except domain you already own)

| Part | Service | Cost |
|------|---------|------|
| Frontend | Netlify | Free |
| Database + API + images | Supabase | Free |
| Email (optional at first) | Brevo | Free tier |
| Domain | GoDaddy | Already paid until Dec 2027 |

---

## Step 1 — Create Supabase project

1. Go to [supabase.com](https://supabase.com) → **Start your project** → New organization (if needed) → **New project**.
2. Choose a name (e.g. `marostica-dental`), set a **database password** (save it somewhere safe).
3. Pick region **EU (Frankfurt)** — closest to Italy.
4. Wait until the project is ready (~2 minutes).
5. Open **Project Settings → API** and copy:
   - **Project URL** → `https://xxxxx.supabase.co`
   - **anon public** key
   - **service_role** key (secret — never put in Netlify, only Supabase secrets)

**Project ref** = the ID in the URL: `https://supabase.com/dashboard/project/` **`abcdefghij`**

---

## Step 2 — Local `.env` file

In the project folder:

```powershell
copy .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Restart `npm run dev` after saving.

---

## Step 3 — Database migrations

Install Supabase CLI (once):

```powershell
npm install -g supabase
```

Login and link:

```powershell
supabase login
```

```powershell
cd "c:\Users\OjjOj\Desktop\Work\Mostafa Mortada\Mostafa"
```

```powershell
supabase link --project-ref YOUR_PROJECT_REF
```

Push schema + seed data:

```powershell
supabase db push
```

Default admin: **username** `admin` · **password** `changeme` (change after first login).

---

## Step 4 — Edge Function secrets

In Supabase Dashboard → **Edge Functions → Secrets**, add only **custom** secrets (names cannot start with `SUPABASE_`):

| Name | Value |
|------|--------|
| `SITE_URL` | `http://localhost:3000` (change to your domain after Netlify) |

Optional later: `BREVO_API_KEY`, `BREVO_FROM_EMAIL`, `ADMIN_NOTIFY_EMAIL`

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are **automatic** — do not set them manually.

Or via CLI:

```powershell
supabase secrets set SITE_URL=http://localhost:3000
```

Deploy functions (run each line):

```powershell
supabase functions deploy admin-login
supabase functions deploy admin-me
supabase functions deploy get-availability
supabase functions deploy create-booking
supabase functions deploy admin-api
supabase functions deploy submit-review
supabase functions deploy subscribe-newsletter
```

---

## Step 5 — GitHub repo (for Netlify)

Netlify deploys from Git. This project should have **its own repo** (not your whole user folder).

```powershell
cd "c:\Users\OjjOj\Desktop\Work\Mostafa Mortada\Mostafa"
git init
git add .
git commit -m "Initial commit — Studio Dentistico Marostica"
```

Create an empty repo on GitHub, then:

```powershell
git remote add origin https://github.com/YOUR_USER/studio-dentistico-marostica.git
git branch -M main
git push -u origin main
```

---

## Step 6 — Netlify deploy

1. Go to [netlify.com](https://netlify.com) → Sign up (free) → **Add new site → Import an existing project**.
2. Connect **GitHub** → select your repo.
3. Build settings (should auto-read `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Site configuration → Environment variables** → Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy → you get a URL like `https://random-name.netlify.app`.
6. Update Supabase secret `SITE_URL` to that Netlify URL until the custom domain works.

Test:

- Public site loads
- `/admin/login` works with `admin` / `changeme`
- Contact form submits a booking

---

## Step 7 — Connect GoDaddy domain

In **Netlify** → Site → **Domain management → Add custom domain** → enter `studiodentisticomarostica.it`.

Netlify shows DNS records. In **GoDaddy → My Domains → DNS**:

| Type | Name | Value |
|------|------|--------|
| A | `@` | Netlify IP (shown in dashboard, often `75.2.60.5`) |
| CNAME | `www` | `your-site.netlify.app` |

Wait 15 minutes – 48 hours for DNS. Netlify enables HTTPS automatically.

Then set Supabase `SITE_URL` to `https://studiodentisticomarostica.it`.

---

## Step 8 — Keep Supabase awake (free tier)

Free projects can pause after ~7 days without activity.

1. Sign up at [uptimerobot.com](https://uptimerobot.com) (free).
2. Add HTTP monitor on your site URL every **5 days** (or daily).
3. Optional: monitor `https://YOUR_REF.supabase.co/rest/v1/` with anon key header.

---

## Step 9 — After go-live

- [ ] Change admin password from `changeme`
- [ ] Replace placeholder clinic content (address, team, photos)
- [ ] Set up Brevo for booking emails (optional at first)
- [ ] Test full flow: book → admin accept → review invite

---

## Quick reference

| URL | Purpose |
|-----|---------|
| `/` | Public website |
| `/admin/login` | Admin panel |
| Supabase Dashboard | Database, storage, functions |
| Netlify Dashboard | Frontend deploys, domain, env vars |

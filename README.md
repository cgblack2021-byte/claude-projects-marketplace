# Claude Projects Marketplace

A marketplace where you can list projects you've built on Claude, and users can sign up, search the catalog, and buy access. Each listing shows a thumbnail, name, price, and a marketing plan — visitors see only a preview of the plan until they purchase.

## Stack

- **Next.js 14** (App Router, TypeScript, Tailwind CSS)
- **Supabase** — Postgres database, auth (email/password), and storage (thumbnails)
- **Stripe** — Checkout for one-time purchases, webhook to unlock content

## How it works

- `/` — browse & search published projects (name/summary text search)
- `/project/[slug]` — project detail page; shows `marketing_plan_preview` to everyone, and `marketing_plan_full` only to users with a recorded purchase
- `/signup`, `/login` — Supabase email/password auth
- `/account` — a signed-in user's purchase history
- `/admin` — project CRUD (list/create/edit/delete + thumbnail upload), gated to users with `profiles.is_admin = true`
- `POST /api/checkout` — creates a Stripe Checkout Session for the logged-in user
- `POST /api/webhooks/stripe` — on `checkout.session.completed`, writes a row to `purchases` using the Supabase service-role key (bypasses RLS)

## Setup

### 1. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the entire contents of [`supabase/schema.sql`](./supabase/schema.sql). This creates the `profiles`, `projects`, and `purchases` tables with row-level security, a trigger that creates a `profiles` row on signup, and a public `thumbnails` storage bucket.
3. Under **Project Settings → API**, copy the Project URL, `anon` public key, and `service_role` secret key.
4. In **Authentication → Providers**, email/password is enabled by default. For local development you can turn off "Confirm email" under **Authentication → Settings** so you don't need to click an email link after signing up.

### 2. Create a Stripe account

1. Grab your test-mode secret key from **Developers → API keys**.
2. For local webhook testing, install the [Stripe CLI](https://docs.stripe.com/stripe-cli) and run:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   This prints a `whsec_...` signing secret — use it as `STRIPE_WEBHOOK_SECRET` locally.
3. In production, create a webhook endpoint in the Stripe Dashboard pointing at `https://<your-domain>/api/webhooks/stripe`, subscribed to `checkout.session.completed`, and use the signing secret it gives you.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and `NEXT_PUBLIC_SITE_URL`.

### 4. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, sign up for an account, then make yourself an admin so you can add projects:

```sql
update public.profiles set is_admin = true where email = 'you@example.com';
```

Reload the site — an **Admin** link appears in the nav. Use `/admin/new` to add your first project (thumbnail, price, short summary, preview marketing plan, full marketing plan).

### 5. Try a purchase

Use [Stripe's test card](https://docs.stripe.com/testing) `4242 4242 4242 4242`, any future expiry, any CVC. After checkout completes, the webhook records the purchase and the project's full marketing plan unlocks on `/project/[slug]` and shows up under `/account`.

## Deploying

- **Vercel** is the easiest target: import the repo, set the same environment variables in the project settings, and deploy. Point your production Stripe webhook at the deployed `/api/webhooks/stripe` URL.
- Set `NEXT_PUBLIC_SITE_URL` to your production URL so Stripe Checkout redirects land back on the right domain.

## Known follow-ups

- **Next.js version**: pinned to the latest Next 14.2.x (`14.2.35`). There's an [advisory](https://github.com/advisories/GHSA-955p-x3mx-jcvp) affecting Server Actions endpoint disclosure in Next 13–16.2.10, patched in 15.5.21 / 16.2.11. Those are major-version jumps with breaking changes (e.g. async `params`/`searchParams`). This app already follows the advisory's stated mitigation — every Server Action in `src/app/admin/actions.ts` re-checks the caller's admin status inside the action itself rather than trusting page-level auth — but a Next 15/16 migration is still worth doing as a separate pass.
- **Admin bootstrapping** is a manual SQL update; a nicer flow would be an invite-only signup or a one-time setup script.
- **Search** is a simple `ILIKE` match on name/summary; the schema already has a `tsvector` index (`projects_search_idx`) ready for upgrading to Postgres full-text search or ranked results if the catalog grows.

# Setting up {{PROJECT_NAME}}

Thanks for your purchase! This guide walks you through getting **{{PROJECT_NAME}}** running
on your own accounts. It takes about 15–20 minutes and doesn't require any coding experience —
just following the steps below in order.

## What you'll need

- A free [Supabase](https://supabase.com) account (database + auth)
- A free [Netlify](https://netlify.com) or [Vercel](https://vercel.com) account (hosting)
- The code in this zip

## 1. Create your Supabase project

Go to [supabase.com](https://supabase.com) → **New Project**. Pick any name and a strong
database password (save it somewhere safe).

## 2. Run the database schema

In your new project: **SQL Editor** → **New query** → paste the entire contents of
`schema.sql` (included in this zip) → **Run**. You'll see a "destructive operations" warning —
that's normal for any script that creates tables; it's safe to confirm on a brand-new project.

## 3. Grab your API keys

**Settings → API** (or "Data API"). Copy three values:

- **Project URL**
- **anon / public key**
- **service_role key** (click "reveal" — keep this one secret)

## 4. Deploy the code

1. Push the contents of this zip to your own GitHub repository (or upload the folder
   directly if your host supports drag-and-drop deploys).
2. Connect that repository to Netlify or Vercel.
3. In your hosting provider's environment variables settings, add the three Supabase values
   from step 3, using the variable names listed in `.env.example` (included in this zip).
4. Deploy.

## 5. {{OPTIONAL_ADMIN_STEP}}

<!-- Only include this section for projects that have an admin/owner role, e.g.:
Make yourself an admin by running this in Supabase's SQL Editor, with your own email:

    update public.profiles set is_admin = true where email = 'you@example.com';
-->

## 6. You're live

That's it — your own copy of {{PROJECT_NAME}}, running entirely on your own accounts. You own
the code, the data, and the hosting; there's nothing further owed and nothing that can be taken
away.

## Support

Questions about setup? {{SUPPORT_CONTACT}}

# Credit Simplicity

C&I lending platform — apply once, let banks compete for your business.

**Live:** https://credit-simplicity.vercel.app

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Storage)
- **Email:** Resend
- **Hosting:** Vercel

## Setup

### 1. Supabase Project

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`
3. In **Authentication > Settings**, enable "Email" provider and magic links
4. In **Storage**, verify the `documents` bucket was created (the migration does this)

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_your_api_key
NEXT_PUBLIC_SITE_URL=https://credit-simplicity.vercel.app
```

Find your Supabase keys in **Settings > API**.

### 3. Vercel Environment Variables

Set the same env vars in **Vercel > Project Settings > Environment Variables**:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `NEXT_PUBLIC_SITE_URL` | Your production URL |

### 4. Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your sending domain (e.g., `creditsimplicity.com`)
3. Create an API key and add it to env vars

### 5. Local Development

```bash
npm install
npm run dev
```

The app works in **demo mode** when Supabase isn't configured — it shows mock data and simulates form submissions.

## Architecture

- `/apply` — Public application form → POSTs to `/api/apply`
- `/portal/login` — Magic link login
- `/portal` — Authenticated borrower dashboard
- `/portal/documents` — Document upload (Supabase Storage)
- `/portal/loan` — Loan details & messages
- `/portal/meetings` — Meeting schedule
- `/api/apply` — Creates auth user, borrower, loan application, default docs, sends email
- `/api/email` — Generic email sending endpoint via Resend

All portal pages gracefully fall back to mock data when Supabase isn't configured.

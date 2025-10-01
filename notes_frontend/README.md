# Simple Notes App (React + Supabase)

A lightweight personal notes app with magic-link authentication, built with React and Supabase. Styled with the Ocean Professional theme (blue primary, amber accents, subtle shadows, rounded corners).

## Features
- Email magic link (OTP) sign-in (Supabase Auth)
- Create, edit, delete notes
- Debounced autosave for title/content
- Star favorites, search, sort
- Tags support (array field)
- Ocean Professional theme UI

## Setup
1. Install dependencies:
   - npm install
2. Ensure Supabase client:
   - npm install @supabase/supabase-js
3. Create a `.env` in the `notes_frontend` directory:
```
REACT_APP_SUPABASE_URL=your_url
REACT_APP_SUPABASE_KEY=your_anon_key
```
4. Start dev server:
   - npm start

## Supabase configuration
- Enable Email OTP (Magic Link) authentication.

Create the table and RLS policy:
```sql
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  title text not null default '',
  content text not null default '',
  tags text[] default '{}',
  folder text,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notes_user_updated_idx on notes (user_id, updated_at desc);
alter table notes enable row level security;
create policy if not exists "users can manage their notes" on notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## Environment Variables
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY

## Notes
- The app shows a sign-in screen until authenticated.
- Once signed in, you'll see the main layout: left Sidebar, TopBar, NoteList, and NoteEditor.
- Autosave runs after a short pause when typing (debounced).

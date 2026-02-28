-- ============================================================
-- MUKA — Supabase SQL Migration
-- Run this in the Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 0. Clean Slate (Use for Dev/Reset)
drop table if exists public.user_corrections cascade;
drop table if exists public.notifications cascade;

-- ─────────────────────────────────────────────────────────────
-- 1. Notifications Table
-- ─────────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id            uuid          primary key default gen_random_uuid(),

  -- Ownership
  user_id       uuid          not null references auth.users (id) on delete cascade,

  -- Content
  raw_text      text          not null,
  title         text,
  source        text          not null check (source in ('whatsapp', 'email', 'manual', 'gmail', 'classroom')),
  sender        text,
  external_id   text,

  -- AI Classification
  zone          text          not null check (zone in ('instant', 'scheduled', 'batch')),
  confidence    float4        not null default 0,
  ai_model      text          not null default 'facebook/bart-large-mnli',
  fallback_used boolean       not null default false,

  -- User Override
  user_zone     text          check (user_zone in ('instant', 'scheduled', 'batch')),

  -- Action State
  is_dismissed  boolean       not null default false,
  is_snoozed    boolean       not null default false,
  snoozed_until timestamptz,

  -- Timestamps
  created_at    timestamptz   not null default now(),
  classified_at timestamptz   not null default now(),
  updated_at    timestamptz   not null default now(),
  
  -- Deduplication
  unique (user_id, external_id)
);

-- Indexes
create index if not exists idx_notifications_zone_created
  on public.notifications (zone, created_at desc);

create index if not exists idx_notifications_dismissed_zone
  on public.notifications (is_dismissed, zone);

-- Auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger trg_notifications_updated_at
  before update on public.notifications
  for each row execute function public.set_updated_at();


-- ─────────────────────────────────────────────────────────────
-- 2. user_corrections
-- ─────────────────────────────────────────────────────────────

create table if not exists public.user_corrections (
  id                uuid        primary key default gen_random_uuid(),

  notification_id   uuid        not null
                    references public.notifications (id) on delete cascade,

  original_zone     text        not null check (original_zone in ('instant', 'scheduled', 'batch')),
  corrected_zone    text        not null check (corrected_zone in ('instant', 'scheduled', 'batch')),

  raw_text_snapshot text        not null,
  ai_confidence     float4,

  created_at        timestamptz not null default now()
);

-- Indexes
create index if not exists idx_corrections_notification_id
  on public.user_corrections (notification_id);

create index if not exists idx_corrections_zones
  on public.user_corrections (original_zone, corrected_zone);


-- Link notifications to users
ALTER TABLE public.notifications      ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.telemetry_sessions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.user_corrections   ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- ─────────────────────────────────────────────────────────────
-- 4. User Preferences
-- ─────────────────────────────────────────────────────────────

create table if not exists public.user_preferences (
  user_id            uuid        primary key references auth.users (id) on delete cascade,
  
  -- Delivery Schedule (JSONB for flexibility)
  -- Structure: { windows: [{ id, time, label, active }] }
  delivery_schedule  jsonb       not null default '{"windows": [{"id": "1", "time": "09:00", "label": "Morning Sync", "active": true}, {"id": "2", "time": "13:00", "label": "Lunch Digest", "active": true}, {"id": "3", "time": "18:00", "label": "Evening Review", "active": true}]}',
  
  -- Global Settings
  batch_lock_enabled boolean     not null default false,
  theme              text        not null default 'dark',
  
  updated_at         timestamptz not null default now()
);

-- Trigger for updated_at
create trigger trg_user_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────
-- 5. Row Level Security (RLS)
-- ─────────────────────────────────────────────────────────────

alter table public.notifications      enable row level security;
alter table public.user_corrections   enable row level security;
alter table public.user_preferences   enable row level security;

-- DROP OLD PERMISSIVE POLICIES
DROP POLICY IF EXISTS "allow all (dev)" ON public.notifications;
DROP POLICY IF EXISTS "allow all (dev)" ON public.user_corrections;

-- Policies
create policy "Users can only see their own notifications"
  on public.notifications for all using (auth.uid() = user_id);

create policy "Users can only see their own corrections"
  on public.user_corrections for all using (
    exists (
      select 1 from public.notifications
      where public.notifications.id = notification_id
      and public.notifications.user_id = auth.uid()
    )
  );

create policy "Users can only see their own preferences"
  on public.user_preferences for all using (auth.uid() = user_id);

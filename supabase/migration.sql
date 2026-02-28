-- ============================================================
-- MUKA — Supabase SQL Migration
-- Run this in the Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 1. notifications
-- ─────────────────────────────────────────────────────────────

create table if not exists public.notifications (
  id            uuid          primary key default gen_random_uuid(),

  -- Content
  raw_text      text          not null,
  source        text          not null check (source in ('whatsapp', 'email', 'manual', 'gmail', 'classroom')),
  sender        text,

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
  updated_at    timestamptz   not null default now()
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
-- 2. telemetry_sessions
-- ─────────────────────────────────────────────────────────────

create table if not exists public.telemetry_sessions (
  id                   uuid        primary key default gen_random_uuid(),

  session_start        timestamptz not null default now(),
  session_end          timestamptz,

  total_ingested       int         not null default 0,
  instant_count        int         not null default 0,
  scheduled_count      int         not null default 0,
  batch_count          int         not null default 0,

  spam_blocked         int         not null default 0,
  time_saved_seconds   int         not null default 0,
  focus_score          float4      not null default 100,

  created_at           timestamptz not null default now()
);


-- ─────────────────────────────────────────────────────────────
-- 3. user_corrections
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


-- ─────────────────────────────────────────────────────────────
-- 4. Row Level Security (RLS)
-- ─────────────────────────────────────────────────────────────

alter table public.notifications      enable row level security;
alter table public.telemetry_sessions enable row level security;
alter table public.user_corrections   enable row level security;

-- ⚠ Open policies for v1.0 (no auth yet).
-- Replace with auth.uid() checks in Phase 2.

create policy "allow all (dev)"
  on public.notifications for all using (true);

create policy "allow all (dev)"
  on public.telemetry_sessions for all using (true);

create policy "allow all (dev)"
  on public.user_corrections for all using (true);

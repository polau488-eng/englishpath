-- ============================================================
-- EnglishPath — Supabase Database Schema
-- Chạy toàn bộ file này trong Supabase SQL Editor
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- TABLES
-- ============================================================

-- Users (extends Supabase auth.users)
create table public.users (
  id            uuid references auth.users(id) on delete cascade primary key,
  email         text unique not null,
  name          text not null default '',
  avatar_url    text,
  current_level text not null default 'A1' check (current_level in ('A1','A2','B1','B2')),
  xp            integer not null default 0 check (xp >= 0),
  streak        integer not null default 0 check (streak >= 0),
  streak_shield integer not null default 1 check (streak_shield between 0 and 3),
  last_active   date not null default current_date,
  is_premium    boolean not null default false,
  premium_until timestamptz,
  daily_goal    integer not null default 15,
  reminder_time text default '20:00',
  notifications boolean not null default true,
  created_at    timestamptz not null default now()
);

-- Lessons
create table public.lessons (
  id               text primary key,
  title            text not null,
  description      text not null default '',
  level            text not null check (level in ('A1','A2','B1','B2')),
  skill            text not null check (skill in ('listening','speaking','reading','writing','grammar')),
  duration_minutes integer not null default 20,
  xp_reward        integer not null default 50,
  lesson_order     integer not null default 0,
  is_premium       boolean not null default false,
  audio_url        text,
  thumbnail_url    text,
  content          jsonb not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index lessons_level_skill_idx on public.lessons(level, skill);
create index lessons_order_idx on public.lessons(level, lesson_order);

-- User progress per lesson
create table public.user_progress (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid not null references public.users(id) on delete cascade,
  lesson_id    text not null references public.lessons(id) on delete cascade,
  completed    boolean not null default false,
  score        integer not null default 0 check (score between 0 and 100),
  time_spent   integer not null default 0,
  attempts     integer not null default 1,
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique(user_id, lesson_id)
);
create index user_progress_user_idx on public.user_progress(user_id);

-- Vocabulary / SRS Cards
create table public.srs_cards (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid not null references public.users(id) on delete cascade,
  word         text not null,
  ipa          text not null default '',
  meaning_vi   text not null,
  example      text not null default '',
  audio_url    text,
  level        text not null default 'A1',
  topic        text not null default 'general',
  interval     integer not null default 1,
  ease_factor  numeric(4,2) not null default 2.50,
  due_date     timestamptz not null default now(),
  repetitions  integer not null default 0,
  last_quality integer check (last_quality between 0 and 5),
  created_at   timestamptz not null default now()
);
create index srs_due_idx on public.srs_cards(user_id, due_date);
create index srs_word_idx on public.srs_cards using gin(word gin_trgm_ops);

-- Daily streak log
create table public.streak_log (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid not null references public.users(id) on delete cascade,
  log_date   date not null default current_date,
  xp_earned  integer not null default 0,
  lessons_done integer not null default 0,
  unique(user_id, log_date)
);

-- Badges master list
create table public.badges (
  id          text primary key,
  name        text not null,
  description text not null,
  icon        text not null,
  criteria    jsonb not null default '{}',
  xp_reward   integer not null default 0,
  is_active   boolean not null default true
);

-- User badges earned
create table public.user_badges (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid not null references public.users(id) on delete cascade,
  badge_id   text not null references public.badges(id),
  earned_at  timestamptz not null default now(),
  unique(user_id, badge_id)
);

-- AI writing submissions (for history)
create table public.writing_submissions (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid not null references public.users(id) on delete cascade,
  prompt_id   text,
  content     text not null,
  word_count  integer not null default 0,
  ai_feedback jsonb,
  score       integer check (score between 0 and 100),
  level       text not null default 'A2',
  created_at  timestamptz not null default now()
);
create index writing_user_idx on public.writing_submissions(user_id, created_at desc);

-- Stripe subscriptions
create table public.subscriptions (
  id                  uuid default uuid_generate_v4() primary key,
  user_id             uuid not null references public.users(id) on delete cascade unique,
  stripe_customer_id  text unique,
  stripe_sub_id       text unique,
  plan                text not null default 'free' check (plan in ('free','premium','pro')),
  status              text not null default 'active',
  current_period_end  timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create user profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Increment XP (atomic)
create or replace function public.add_xp(p_user_id uuid, p_amount integer)
returns integer language plpgsql security definer as $$
declare v_new_xp integer;
begin
  update public.users
  set xp = xp + p_amount
  where id = p_user_id
  returning xp into v_new_xp;
  return v_new_xp;
end;
$$;

-- Update streak on daily activity
create or replace function public.update_streak(p_user_id uuid)
returns integer language plpgsql security definer as $$
declare
  v_last_active date;
  v_streak integer;
  v_shield integer;
begin
  select last_active, streak, streak_shield
  into v_last_active, v_streak, v_shield
  from public.users where id = p_user_id for update;

  if v_last_active = current_date then
    return v_streak; -- already logged today
  elsif v_last_active = current_date - 1 then
    -- consecutive day
    update public.users set streak = streak + 1, last_active = current_date where id = p_user_id returning streak into v_streak;
  elsif v_last_active = current_date - 2 and v_shield > 0 then
    -- missed one day but shield saves it
    update public.users set streak = streak + 1, last_active = current_date, streak_shield = streak_shield - 1 where id = p_user_id returning streak into v_streak;
  else
    -- streak broken
    update public.users set streak = 1, last_active = current_date where id = p_user_id returning streak into v_streak;
  end if;

  -- Log today
  insert into public.streak_log (user_id, log_date)
  values (p_user_id, current_date)
  on conflict (user_id, log_date) do nothing;

  return v_streak;
end;
$$;

-- Auto-award badges after progress update
create or replace function public.check_and_award_badges(p_user_id uuid)
returns void language plpgsql security definer as $$
declare
  v_xp integer;
  v_streak integer;
  v_lessons_done integer;
  v_words_learned integer;
begin
  select xp, streak into v_xp, v_streak from public.users where id = p_user_id;
  select count(*) into v_lessons_done from public.user_progress where user_id = p_user_id and completed = true;
  select count(*) into v_words_learned from public.srs_cards where user_id = p_user_id;

  -- First lesson
  if v_lessons_done >= 1 then
    insert into public.user_badges(user_id, badge_id) values (p_user_id, 'first-step') on conflict do nothing;
  end if;
  -- 7-day streak
  if v_streak >= 7 then
    insert into public.user_badges(user_id, badge_id) values (p_user_id, 'week-warrior') on conflict do nothing;
  end if;
  -- 30-day streak
  if v_streak >= 30 then
    insert into public.user_badges(user_id, badge_id) values (p_user_id, 'streak-legend') on conflict do nothing;
  end if;
  -- 300 words
  if v_words_learned >= 300 then
    insert into public.user_badges(user_id, badge_id) values (p_user_id, 'vocab-master') on conflict do nothing;
  end if;
  -- 1000 XP
  if v_xp >= 1000 then
    insert into public.user_badges(user_id, badge_id) values (p_user_id, 'xp-1000') on conflict do nothing;
  end if;
  -- 20 lessons
  if v_lessons_done >= 20 then
    insert into public.user_badges(user_id, badge_id) values (p_user_id, 'dedicated-learner') on conflict do nothing;
  end if;
end;
$$;

-- Updated_at auto-trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger lessons_updated_at before update on public.lessons
  for each row execute procedure public.set_updated_at();
create trigger progress_updated_at before update on public.user_progress
  for each row execute procedure public.set_updated_at();
create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users              enable row level security;
alter table public.user_progress      enable row level security;
alter table public.srs_cards          enable row level security;
alter table public.streak_log         enable row level security;
alter table public.user_badges        enable row level security;
alter table public.writing_submissions enable row level security;
alter table public.subscriptions      enable row level security;
alter table public.lessons            enable row level security;
alter table public.badges             enable row level security;

-- Users
create policy "users_select_own" on public.users for select using (auth.uid() = id);
create policy "users_update_own" on public.users for update using (auth.uid() = id);

-- Lessons (public read)
create policy "lessons_select_all"  on public.lessons for select using (true);

-- Badges (public read)
create policy "badges_select_all"   on public.badges  for select using (true);

-- User-specific tables
create policy "progress_select_own" on public.user_progress for select using (auth.uid() = user_id);
create policy "progress_insert_own" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "progress_update_own" on public.user_progress for update using (auth.uid() = user_id);

create policy "srs_select_own"      on public.srs_cards for select using (auth.uid() = user_id);
create policy "srs_insert_own"      on public.srs_cards for insert with check (auth.uid() = user_id);
create policy "srs_update_own"      on public.srs_cards for update using (auth.uid() = user_id);
create policy "srs_delete_own"      on public.srs_cards for delete using (auth.uid() = user_id);

create policy "streak_select_own"   on public.streak_log for select using (auth.uid() = user_id);
create policy "badges_select_own"   on public.user_badges for select using (auth.uid() = user_id);
create policy "writing_select_own"  on public.writing_submissions for select using (auth.uid() = user_id);
create policy "writing_insert_own"  on public.writing_submissions for insert with check (auth.uid() = user_id);
create policy "sub_select_own"      on public.subscriptions for select using (auth.uid() = user_id);

-- ============================================================
-- SEED DATA — Badges
-- ============================================================

insert into public.badges (id, name, description, icon, xp_reward) values
  ('first-step',       'First Step',       'Hoàn thành bài học đầu tiên',           '🎯', 50),
  ('week-warrior',     'Week Warrior',     'Học 7 ngày liên tiếp',                   '🔥', 100),
  ('streak-legend',    'Streak Legend',    'Học 30 ngày liên tiếp',                  '💎', 500),
  ('vocab-master',     'Vocab Master',     'Học 300 từ vựng',                        '📚', 200),
  ('xp-1000',          'XP Hunter',        'Đạt 1,000 XP',                           '⚡', 100),
  ('dedicated-learner','Dedicated Learner','Hoàn thành 20 bài học',                  '✅', 150),
  ('speed-listener',   'Speed Listener',   'Nghe audio ở tốc độ 1.5x',               '🎧', 75),
  ('essay-writer',     'Essay Writer',     'Viết bài 200+ từ và nhận AI feedback',   '✍️', 100),
  ('b2-graduate',      'B2 Graduate',      'Hoàn thành toàn bộ lộ trình B2',         '🏆', 1000),
  ('grammar-pro',      'Grammar Pro',      'Hoàn thành tất cả bài ngữ pháp A2',      '📐', 150)
on conflict do nothing;

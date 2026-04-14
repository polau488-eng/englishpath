# EnglishPath — Nền tảng học tiếng Anh A1→B2

Website học tiếng Anh toàn diện với 4 kỹ năng + Ngữ pháp, AI feedback, Gamification và lộ trình thích ứng.

## Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **State**: Zustand (persist localStorage)
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude API (Anthropic) cho Writing Coach & AI Tutor
- **Charts**: Recharts
- **Deploy**: Vercel

## Cấu trúc dự án
```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── placement-test/page.tsx     # Kiểm tra trình độ
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard tổng quan
│   │   ├── lessons/page.tsx        # Danh sách bài học
│   │   ├── vocabulary/page.tsx     # Từ vựng + Flashcard SRS
│   │   ├── grammar/page.tsx        # Ngữ pháp theo cấp độ
│   │   ├── listening/page.tsx      # Kỹ năng Nghe
│   │   ├── speaking/page.tsx       # Kỹ năng Nói
│   │   ├── reading/page.tsx        # Kỹ năng Đọc
│   │   ├── writing/page.tsx        # Writing Studio + AI
│   │   ├── practice/page.tsx       # Luyện tập hàng ngày
│   │   ├── mock-test/page.tsx      # Thi thử IELTS/TOEIC
│   │   ├── profile/page.tsx        # Hồ sơ người dùng
│   │   └── settings/page.tsx       # Cài đặt
│   ├── lesson/[id]/page.tsx        # Lesson Player đầy đủ
│   └── api/ai/route.ts             # Claude API endpoint
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx             # Sidebar với user card
│   │   └── Header.tsx              # Header sticky
│   └── ui/
│       ├── Progress.tsx            # Progress bar
│       └── Badge.tsx               # Level/Skill badges
├── lib/
│   ├── utils.ts                    # Helpers + config
│   ├── supabase.ts                 # DB queries
│   ├── store.ts                    # Zustand store
│   └── mock-data.ts                # Dữ liệu demo
└── types/index.ts                  # TypeScript types
```

## Cài đặt & Chạy local

### 1. Clone và cài dependencies
```bash
git clone <your-repo>
cd english-learning-platform
npm install
```

### 2. Cấu hình biến môi trường
```bash
cp .env.local.example .env.local
```

Điền vào `.env.local`:
```env
# Supabase (tạo project miễn phí tại supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# NextAuth
NEXTAUTH_SECRET=your_random_secret_string_32_chars_min

# Claude API (cần để dùng AI Writing Coach)
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### 3. Tạo database Supabase
Chạy SQL này trong Supabase SQL Editor:
```sql
-- Users table
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null,
  current_level text default 'A1',
  xp integer default 0,
  streak integer default 0,
  streak_shield integer default 0,
  is_premium boolean default false,
  created_at timestamptz default now(),
  last_active timestamptz default now()
);

-- Lessons table
create table lessons (
  id text primary key,
  title text not null,
  description text,
  level text not null,
  skill text not null,
  duration_minutes integer default 20,
  xp_reward integer default 80,
  "order" integer default 0,
  content jsonb,
  created_at timestamptz default now()
);

-- User progress
create table user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  lesson_id text references lessons(id),
  completed boolean default false,
  score integer default 0,
  time_spent integer default 0,
  completed_at timestamptz,
  unique(user_id, lesson_id)
);

-- SRS Cards
create table srs_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  word text not null,
  ipa text,
  meaning_vi text,
  example text,
  interval integer default 1,
  ease_factor numeric default 2.5,
  due_date timestamptz default now(),
  repetitions integer default 0
);

-- XP increment function
create or replace function increment_xp(user_id uuid, amount integer)
returns void as $$
  update users set xp = xp + amount where id = user_id;
$$ language sql;
```

### 4. Chạy development server
```bash
npm run dev
```

Mở http://localhost:3000

## Deploy lên Vercel

1. Push code lên GitHub
2. Vào [vercel.com](https://vercel.com) → Import project
3. Thêm Environment Variables (giống `.env.local`)
4. Deploy!

## Thêm nội dung bài học
Thêm bài học vào `src/lib/mock-data.ts` → array `MOCK_LESSONS`.  
Sau khi tích hợp Supabase đầy đủ, bài học được quản lý qua database.

## Roadmap tiếp theo
- [ ] Authentication với NextAuth.js + Google OAuth
- [ ] Admin panel quản lý nội dung
- [ ] Web Speech API cho Speaking module
- [ ] Audio upload và streaming với Cloudinary
- [ ] Leaderboard real-time với Supabase Realtime
- [ ] Mobile app với Expo (React Native)
- [ ] IELTS Writing AI checker hoàn chỉnh
- [ ] Subscription billing với Stripe

# EnglishPath — Nền tảng học tiếng Anh A1→B2

Website học tiếng Anh toàn diện: 4 kỹ năng (Nghe · Nói · Đọc · Viết) + Ngữ pháp, AI cá nhân hóa, Spaced Repetition và lộ trình A1→B2.

---

## Tech Stack

| Layer      | Tech                                                    |
|------------|---------------------------------------------------------|
| Frontend   | Next.js 14 (App Router) · TypeScript · Tailwind CSS     |
| State      | Zustand · React Hot Toast                               |
| Charts     | Recharts                                                |
| Database   | Supabase (PostgreSQL + Realtime + Auth)                 |
| AI         | Claude API (writing coach, tutor, roleplay)             |
| Speech     | Web Speech API (recording) · Browser TTS (playback)    |
| Payment    | Stripe (subscriptions)                                  |
| Deploy     | Vercel                                                  |

---

## Cấu trúc thư mục

```
englishpath/
├── supabase/
│   └── schema.sql              ← Toàn bộ SQL: tables, functions, RLS
├── src/
│   ├── app/
│   │   ├── page.tsx            ← Landing page
│   │   ├── layout.tsx          ← Root layout
│   │   ├── auth/
│   │   │   ├── login/          ← Đăng nhập (Google + Email)
│   │   │   ├── register/       ← Đăng ký
│   │   │   └── callback/       ← OAuth callback
│   │   ├── placement-test/     ← Kiểm tra trình độ A1–B2
│   │   ├── pricing/            ← Trang gói cước
│   │   ├── dashboard/
│   │   │   ├── page.tsx        ← Dashboard tổng quan
│   │   │   ├── lessons/        ← Danh sách bài học
│   │   │   ├── vocabulary/     ← Flashcard + SRS
│   │   │   ├── grammar/        ← Ngữ pháp A1–B2
│   │   │   ├── listening/      ← Listening lab
│   │   │   ├── speaking/       ← Speaking lab (Web Speech)
│   │   │   ├── reading/        ← Reading lab
│   │   │   ├── writing/        ← Writing + AI feedback
│   │   │   ├── practice/       ← Daily exercises + challenges
│   │   │   ├── mock-test/      ← Thi thử IELTS/TOEIC
│   │   │   ├── profile/        ← Hồ sơ người dùng
│   │   │   └── settings/       ← Cài đặt
│   │   ├── lesson/[id]/        ← Lesson player
│   │   └── api/
│   │       ├── ai/             ← Claude API (writing, tutor, roleplay)
│   │       ├── progress/       ← Lưu tiến độ + XP
│   │       └── stripe/         ← Checkout + Webhook
│   ├── components/
│   │   ├── layout/Sidebar.tsx
│   │   ├── layout/Header.tsx
│   │   └── ui/ (Badge, Progress)
│   ├── lib/
│   │   ├── utils.ts            ← Helpers, level/skill config
│   │   ├── store.ts            ← Zustand global state
│   │   ├── supabase.ts         ← DB queries + SM-2 SRS
│   │   └── mock-data.ts        ← Demo data (10 bài học)
│   └── types/index.ts          ← TypeScript types
├── .env.local.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Cài đặt

### 1. Clone & cài dependencies

```bash
git clone <your-repo-url> englishpath
cd englishpath
npm install
```

### 2. Tạo file biến môi trường

```bash
cp .env.local.example .env.local
```

Mở `.env.local` và điền đầy đủ (xem hướng dẫn từng mục bên dưới).

---

## Setup Supabase

### Bước 1 — Tạo project

1. Vào [supabase.com](https://supabase.com) → **New project**
2. Đặt tên, chọn region gần nhất (Singapore)
3. Lưu lại **Project URL** và **anon key** (Settings → API)

### Bước 2 — Chạy schema

1. Vào **SQL Editor** trong Supabase dashboard
2. Copy toàn bộ nội dung `supabase/schema.sql`
3. Paste và nhấn **Run**

Schema sẽ tạo:
- 8 tables: `users`, `lessons`, `user_progress`, `srs_cards`, `streak_log`, `badges`, `user_badges`, `writing_submissions`, `subscriptions`
- 5 functions: `handle_new_user`, `add_xp`, `update_streak`, `check_and_award_badges`, `set_updated_at`
- Row Level Security policies
- Seed data cho 10 badges

### Bước 3 — Cấu hình Auth

Trong Supabase dashboard → **Authentication → Providers**:

**Google OAuth:**
1. Bật **Google provider**
2. Vào [Google Cloud Console](https://console.cloud.google.com)
3. Tạo OAuth 2.0 credentials
4. Authorized redirect URI: `https://<your-project>.supabase.co/auth/v1/callback`
5. Copy Client ID và Secret vào Supabase

**Email Auth:** Đã bật mặc định. Bật **Confirm email** trong Settings → Auth.

### Bước 4 — Điền env vars

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Setup Claude API (AI Features)

1. Vào [console.anthropic.com](https://console.anthropic.com)
2. **API Keys** → Create key
3. Điền vào `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**AI features sử dụng Claude:**
- Writing Coach: chữa lỗi, chấm điểm, gợi ý cải thiện
- AI Tutor: trả lời câu hỏi ngữ pháp, giải thích
- Role-play: hội thoại Speaking tình huống thực

---

## Setup Stripe (Thanh toán Premium)

### Bước 1 — Tạo account & products

1. Vào [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Products** → Add product:
   - **EnglishPath Premium**: 199,000 VND/tháng (recurring)
   - **EnglishPath Pro**: 399,000 VND/tháng (recurring)
3. Copy **Price ID** của từng plan

### Bước 2 — Lấy API keys

Settings → Developers → API keys:

```env
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PREMIUM_PRICE_ID=price_1...
STRIPE_PRO_PRICE_ID=price_1...
```

### Bước 3 — Setup Webhook (cho production)

```bash
# Cài Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks khi dev
stripe listen --forward-to localhost:3000/api/stripe

# Copy webhook secret
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Trên Vercel (production):**
- Stripe Dashboard → Webhooks → Add endpoint
- URL: `https://your-domain.com/api/stripe`
- Events: `checkout.session.completed`, `customer.subscription.deleted`

---

## Chạy Development

```bash
npm run dev
# → http://localhost:3000
```

**Lưu ý:** App chạy với mock data ngay cả khi chưa có Supabase. Tất cả tính năng UI đều hoạt động offline.

---

## Deploy lên Vercel

### Option A — GitHub (Recommended)

```bash
# Push lên GitHub
git init && git add . && git commit -m "initial commit"
git remote add origin https://github.com/<user>/englishpath.git
git push -u origin main
```

1. Vào [vercel.com](https://vercel.com) → Import project từ GitHub
2. **Environment Variables** → Add tất cả vars từ `.env.local`
3. Deploy → Vercel tự động build và deploy

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel
# Chọn settings, điền env vars khi được hỏi
vercel --prod
```

### Sau khi deploy

1. Cập nhật `NEXT_PUBLIC_APP_URL` với domain thật
2. Cập nhật Google OAuth redirect URI với domain thật
3. Thêm domain vào Supabase Authentication → URL Configuration
4. Cấu hình Stripe webhook với URL production

---

## Thêm nội dung bài học (Supabase)

Chạy SQL để insert bài học thật vào database:

```sql
INSERT INTO public.lessons (id, title, description, level, skill, duration_minutes, xp_reward, lesson_order, content)
VALUES (
  'a1-listen-02',
  'Numbers 1-20',
  'Luyện nghe và đọc số từ 1 đến 20.',
  'A1', 'listening', 15, 60, 3,
  '{
    "intro": "Học đếm số tiếng Anh từ 1 đến 20.",
    "sections": [
      {
        "type": "audio",
        "content": "Listen and repeat the numbers.",
        "exercises": [
          {
            "id": "e_num_01",
            "type": "multiple_choice",
            "question": "How do you say 15 in English?",
            "options": ["thirteen", "fourteen", "fifteen", "sixteen"],
            "correct_answer": "fifteen",
            "explanation": "15 = fifteen. Chú ý: 13=thirteen, 14=fourteen, 15=fifteen..."
          }
        ]
      }
    ],
    "vocabulary": [
      {"word": "eleven", "ipa": "/ɪˈlɛvən/", "meaning_vi": "mười một", "example": "There are eleven players."},
      {"word": "twelve",  "ipa": "/twɛlv/",   "meaning_vi": "mười hai",  "example": "A year has twelve months."}
    ]
  }'::jsonb
);
```

---

## Cấu trúc Content (JSON Schema)

```typescript
// Cấu trúc content của một bài học
{
  intro: string,              // Giới thiệu bài
  sections: [
    {
      type: "audio" | "text" | "video" | "exercise",
      content: string,        // Text content hoặc URL
      exercises: [
        {
          id: string,
          type: "multiple_choice" | "fill_blank" | "true_false" | "matching" | "reorder",
          question: string,
          options: string[],  // Cho multiple_choice và true_false
          correct_answer: string | string[],
          explanation: string,
          hint?: string
        }
      ]
    }
  ],
  vocabulary: [
    { word, ipa, meaning_vi, example, audio_url? }
  ],
  grammar_note?: {
    point: string,
    explanation: string,      // Giải thích bằng tiếng Việt
    examples: string[],
    common_mistakes: string[] // Lỗi phổ biến của người Việt
  }
}
```

---

## Production Checklist

### Security
- [ ] Bật RLS cho tất cả Supabase tables ✅ (đã có trong schema.sql)
- [ ] `NEXTAUTH_SECRET` ≥ 32 ký tự random
- [ ] `SUPABASE_SERVICE_ROLE_KEY` chỉ dùng server-side, không expose client
- [ ] Validate tất cả inputs trong API routes
- [ ] Rate limit AI API route (tránh lạm dụng)

### Performance
- [ ] Bật Vercel Analytics
- [ ] Cấu hình `next/image` cho ảnh
- [ ] CDN cho audio/video files (Cloudinary hoặc Supabase Storage)
- [ ] Lazy load Recharts và heavy components

### Monitoring
- [ ] Setup Sentry error tracking
- [ ] Vercel Speed Insights
- [ ] Supabase dashboard cho DB monitoring

### SEO
- [ ] Cập nhật metadata trong `layout.tsx`
- [ ] Tạo `sitemap.xml` và `robots.txt`
- [ ] Open Graph images cho social sharing

---

## Roadmap Phase 2

- [ ] Real audio files (Cloudinary + ElevenLabs TTS)
- [ ] 360+ bài học thực tế đầy đủ
- [ ] PWA — học offline
- [ ] Email nhắc nhở (Resend)
- [ ] Admin panel quản lý nội dung
- [ ] Mobile app (React Native / Expo)
- [ ] Live 1-on-1 sessions với giáo viên
- [ ] B2+ / C1 content
- [ ] Team/School plan với dashboard giáo viên

---

## Support

Gặp vấn đề khi setup? Kiểm tra:
1. Supabase SQL Editor → Logs
2. Vercel → Functions logs
3. Browser Console cho client errors
4. Stripe Dashboard → Events cho webhook issues

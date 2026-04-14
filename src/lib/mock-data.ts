import type { DashboardStats, Lesson, PlacementQuestion, User } from "@/types";

export const MOCK_USER: User = {
  id: "user-1",
  email: "hoc.vien@example.com",
  name: "Nguyễn Minh Khoa",
  current_level: "A2",
  xp: 2340,
  streak: 12,
  streak_shield: 1,
  created_at: "2024-01-10T00:00:00Z",
  last_active: new Date().toISOString(),
  is_premium: false,
};

export const MOCK_DASHBOARD: DashboardStats = {
  total_xp: 2340,
  current_streak: 12,
  lessons_completed: 28,
  words_learned: 312,
  weekly_progress: [
    { day: "T2", xp: 120, lessons: 2 },
    { day: "T3", xp: 85,  lessons: 1 },
    { day: "T4", xp: 200, lessons: 3 },
    { day: "T5", xp: 60,  lessons: 1 },
    { day: "T6", xp: 175, lessons: 2 },
    { day: "T7", xp: 310, lessons: 4 },
    { day: "CN", xp: 95,  lessons: 1 },
  ],
  skill_breakdown: [
    { skill: "listening", score: 72, total: 100 },
    { skill: "speaking",  score: 45, total: 100 },
    { skill: "reading",   score: 81, total: 100 },
    { skill: "writing",   score: 58, total: 100 },
    { skill: "grammar",   score: 69, total: 100 },
  ],
  recent_lessons: [
    { id: "l1", title: "Daily Routines", skill: "listening", level: "A2", completed_at: "2024-03-10T10:00:00Z", score: 88 },
    { id: "l2", title: "Present Perfect", skill: "grammar",  level: "A2", completed_at: "2024-03-09T15:30:00Z", score: 74 },
    { id: "l3", title: "My Neighborhood", skill: "reading",  level: "A2", completed_at: "2024-03-09T09:00:00Z", score: 92 },
    { id: "l4", title: "Shopping Dialogue", skill: "speaking", level: "A2", completed_at: "2024-03-08T18:00:00Z", score: 61 },
  ],
  badges: [
    { id: "b1", name: "First Step",     description: "Hoàn thành bài học đầu tiên",  icon: "🎯", earned: true,  earned_at: "2024-01-10T00:00:00Z" },
    { id: "b2", name: "Week Warrior",   description: "Học 7 ngày liên tiếp",          icon: "🔥", earned: true,  earned_at: "2024-01-17T00:00:00Z" },
    { id: "b3", name: "Vocab Master",   description: "Học 300 từ vựng",              icon: "📚", earned: true,  earned_at: "2024-02-15T00:00:00Z" },
    { id: "b4", name: "Grammar Guru",   description: "Hoàn thành tất cả bài ngữ pháp A1", icon: "📐", earned: true,  earned_at: "2024-02-20T00:00:00Z" },
    { id: "b5", name: "Speed Listener", description: "Nghe ở tốc độ 1.5x",           icon: "⚡", earned: false },
    { id: "b6", name: "Essay Writer",   description: "Viết essay 200 từ",             icon: "✍️", earned: false },
    { id: "b7", name: "Streak Legend",  description: "Học 30 ngày liên tiếp",         icon: "💎", earned: false },
    { id: "b8", name: "B2 Graduate",    description: "Hoàn thành lộ trình B2",        icon: "🏆", earned: false },
  ],
  level_progress: { level: "A2", lessons_completed: 28, lessons_total: 80, percentage: 35 },
};

export const MOCK_LESSONS: Lesson[] = [
  {
    id: "l-a2-01", title: "Daily Routines & Habits", description: "Học cách mô tả thói quen hàng ngày bằng Present Simple và adverbs of frequency.",
    level: "A2", skill: "listening", duration_minutes: 20, xp_reward: 80, order: 1, status: "completed",
    content: {
      intro: "Trong bài này, bạn sẽ nghe về thói quen hàng ngày của hai người bạn và học cách diễn đạt lịch trình của mình.",
      sections: [
        {
          type: "audio",
          content: "Nghe đoạn hội thoại giữa Tom và Sarah về lịch trình buổi sáng.",
          exercises: [
            {
              id: "e1", type: "multiple_choice",
              question: "What time does Tom usually wake up?",
              options: ["6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM"],
              correct_answer: "6:30 AM",
              explanation: "Tom says 'I usually wake up at half past six' — 'half past six' = 6:30.",
            },
            {
              id: "e2", type: "fill_blank",
              question: "Sarah ______ (go) to the gym every morning before work.",
              options: [],
              correct_answer: "goes",
              explanation: "Dùng Present Simple với 'she' → thêm -s: go → goes.",
              hint: "Present Simple với he/she/it thêm -s hoặc -es.",
            },
          ],
        },
      ],
      vocabulary: [
        { word: "routine",   ipa: "/ruːˈtiːn/",   meaning_vi: "thói quen, lịch trình hàng ngày", example: "I have a strict morning routine." },
        { word: "commute",   ipa: "/kəˈmjuːt/",   meaning_vi: "đi làm (hàng ngày)",              example: "My commute takes 45 minutes." },
        { word: "frequency", ipa: "/ˈfriːkwənsi/", meaning_vi: "tần suất",                         example: "I visit my parents with great frequency." },
      ],
      grammar_note: {
        point: "Adverbs of Frequency",
        explanation: "Trạng từ tần suất đứng TRƯỚC động từ thường nhưng SAU động từ 'to be'.",
        examples: ["I always drink coffee in the morning.", "She is never late for work.", "We usually have dinner at 7 PM."],
        common_mistakes: ["❌ I drink always coffee → ✅ I always drink coffee", "❌ He is usually tired → ✅ He is usually tired (đúng rồi!)"],
      },
    },
  },
  {
    id: "l-a2-02", title: "Present Perfect — Đã làm gì rồi?", description: "Hiểu và dùng Present Perfect để nói về kinh nghiệm và kết quả hiện tại.",
    level: "A2", skill: "grammar", duration_minutes: 25, xp_reward: 100, order: 2, status: "completed",
    content: {
      intro: "Present Perfect là thì khó nhất với người Việt. Bài này giải thích rõ ràng khi nào dùng và khi nào không dùng.",
      sections: [
        {
          type: "text",
          content: "**Cấu trúc:** S + have/has + V(past participle)\n\n**Khi nào dùng:**\n1. Kinh nghiệm (ever/never): Have you ever been to Japan?\n2. Kết quả liên quan đến hiện tại: I've lost my keys (tôi vẫn chưa tìm thấy)\n3. Mới xảy ra (just/recently): She has just called.",
          exercises: [
            {
              id: "e3", type: "multiple_choice",
              question: "Câu nào ĐÚNG về ngữ pháp?",
              options: ["I have seen this film yesterday.", "I saw this film yesterday.", "I have see this film.", "I have saw this film."],
              correct_answer: "I saw this film yesterday.",
              explanation: "Khi có 'yesterday' (thời gian cụ thể trong quá khứ) → dùng Past Simple, không dùng Present Perfect.",
            },
          ],
        },
      ],
      vocabulary: [
        { word: "experience", ipa: "/ɪkˈspɪərɪəns/", meaning_vi: "kinh nghiệm, trải nghiệm", example: "Have you ever experienced an earthquake?" },
        { word: "recently",   ipa: "/ˈriːsntli/",     meaning_vi: "gần đây",                  example: "Have you seen any good films recently?" },
      ],
      grammar_note: {
        point: "Present Perfect vs Past Simple",
        explanation: "Đây là lỗi sai phổ biến nhất của người Việt học tiếng Anh.",
        examples: ["I have visited Paris. (kinh nghiệm, không nói khi nào)", "I visited Paris in 2022. (thời điểm cụ thể → Past Simple)"],
        common_mistakes: ["❌ I have gone to Hanoi yesterday → ✅ I went to Hanoi yesterday", "❌ Did you ever try sushi? → ✅ Have you ever tried sushi?"],
      },
    },
  },
  {
    id: "l-a2-03", title: "My Neighborhood", description: "Đọc và hiểu văn bản mô tả khu phố, luyện kỹ năng tìm ý chính.",
    level: "A2", skill: "reading", duration_minutes: 20, xp_reward: 75, order: 3, status: "completed",
    content: {
      intro: "Đọc bài viết về khu phố của Emma và trả lời các câu hỏi đọc hiểu.",
      sections: [
        {
          type: "text",
          content: "**My Neighborhood** by Emma\n\nI live in a small but lively neighborhood in the city center. There is a park near my house where people walk their dogs every morning. Next to the park, there is a farmers' market that opens every Saturday. I love buying fresh vegetables and homemade bread there.\n\nMy street is quiet during the week but gets quite busy on weekends. There are several small cafés and a library that I visit regularly. The best thing about my neighborhood is the sense of community — everyone knows each other, and people always say hello when they pass on the street.",
          exercises: [
            {
              id: "e4", type: "true_false",
              question: "The farmers' market opens every day.",
              options: ["True", "False", "Not Given"],
              correct_answer: "False",
              explanation: "The text says the market opens 'every Saturday', not every day.",
            },
            {
              id: "e5", type: "multiple_choice",
              question: "According to Emma, what is the BEST thing about her neighborhood?",
              options: ["The park nearby", "The cafés and library", "The sense of community", "The farmers' market"],
              correct_answer: "The sense of community",
              explanation: "Emma explicitly says 'The best thing about my neighborhood is the sense of community'.",
            },
          ],
        },
      ],
      vocabulary: [
        { word: "lively",    ipa: "/ˈlaɪvli/",     meaning_vi: "sôi động, náo nhiệt",  example: "The market is always lively on weekends." },
        { word: "community", ipa: "/kəˈmjuːnɪti/", meaning_vi: "cộng đồng",            example: "We have a strong sense of community here." },
        { word: "regularly", ipa: "/ˈreɡjələli/",   meaning_vi: "thường xuyên, đều đặn", example: "She exercises regularly to stay healthy." },
      ],
    },
  },
  {
    id: "l-a2-04", title: "Shopping Dialogue", description: "Luyện nói trong tình huống mua sắm — hỏi giá, thương lượng, thanh toán.",
    level: "A2", skill: "speaking", duration_minutes: 20, xp_reward: 90, order: 4, status: "in_progress",
    content: {
      intro: "Học cách giao tiếp tự nhiên khi mua sắm bằng tiếng Anh.",
      sections: [
        {
          type: "exercise",
          content: "Luyện phát âm các cụm từ dưới đây, sau đó thực hành hội thoại với AI.",
          exercises: [
            {
              id: "e6", type: "multiple_choice",
              question: "Bạn muốn hỏi giá một chiếc áo. Câu nào tự nhiên nhất?",
              options: ["What is the cost of this shirt?", "How much does this shirt cost?", "What price is this shirt?", "How many money is this shirt?"],
              correct_answer: "How much does this shirt cost?",
              explanation: "'How much does it cost?' là cách hỏi giá tự nhiên nhất trong giao tiếp hàng ngày.",
            },
          ],
        },
      ],
      vocabulary: [
        { word: "bargain",  ipa: "/ˈbɑːɡɪn/",  meaning_vi: "món hời, giá hời",     example: "That coat was a real bargain at $20!" },
        { word: "receipt",  ipa: "/rɪˈsiːt/",   meaning_vi: "hóa đơn, biên lai",    example: "Can I have a receipt, please?" },
        { word: "exchange", ipa: "/ɪksˈtʃeɪndʒ/", meaning_vi: "đổi (hàng)",          example: "I'd like to exchange this for a smaller size." },
      ],
    },
  },
  {
    id: "l-a2-05", title: "Email Writing Basics", description: "Viết email thông dụng: xin lỗi, cảm ơn, yêu cầu đơn giản.",
    level: "A2", skill: "writing", duration_minutes: 30, xp_reward: 110, order: 5, status: "available",
    content: {
      intro: "Trong bài này bạn sẽ học cấu trúc email tiếng Anh và viết email cảm ơn đơn giản.",
      sections: [],
      grammar_note: {
        point: "Email Opening & Closing",
        explanation: "Email tiếng Anh có cấu trúc cố định: Greeting → Body → Closing → Signature.",
        examples: ["Dear Mr. Smith, / Hi John,", "I am writing to...", "Best regards, / Sincerely,"],
        common_mistakes: ["❌ Dear Mr. John → ✅ Dear John (casual) hoặc Dear Mr. Smith (formal)", "❌ Best regard → ✅ Best regards (luôn có 's')"],
      },
    },
  },
  {
    id: "l-b1-01", title: "Conditional Sentences", description: "Câu điều kiện loại 1 và 2 — giả định thực tế và không thực tế.",
    level: "B1", skill: "grammar", duration_minutes: 30, xp_reward: 130, order: 1, status: "locked",
    content: { intro: "Bài học này yêu cầu hoàn thành A2 trước.", sections: [] },
  },
];

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  { id: 1, skill: "grammar", level: "A1", question: "She ___ a teacher.", options: ["am", "is", "are", "be"], correct: 1 },
  { id: 2, skill: "grammar", level: "A1", question: "I ___ to school every day.", options: ["go", "goes", "going", "gone"], correct: 0 },
  { id: 3, skill: "reading", level: "A1", question: "What does 'happy' mean in Vietnamese?", options: ["Buồn", "Tức giận", "Vui vẻ", "Mệt mỏi"], correct: 2 },
  { id: 4, skill: "grammar", level: "A2", question: "I ___ Paris in 2019.", options: ["have visited", "visited", "visit", "am visiting"], correct: 1 },
  { id: 5, skill: "grammar", level: "A2", question: "She ___ here for 3 years.", options: ["lived", "lives", "has lived", "is living"], correct: 2 },
  { id: 6, skill: "reading", level: "A2", question: "Choose the correct word: 'I need to ___ my report before the deadline.'", options: ["finish", "finished", "finishing", "finishes"], correct: 0 },
  { id: 7, skill: "grammar", level: "B1", question: "If I ___ more time, I would learn Japanese.", options: ["have", "had", "having", "has"], correct: 1 },
  { id: 8, skill: "grammar", level: "B1", question: "The report ___ by the manager yesterday.", options: ["wrote", "was written", "has written", "is written"], correct: 1 },
  { id: 9, skill: "reading", level: "B1", question: "'Despite the rain, they continued the match.' — 'Despite' means:", options: ["Because of", "Although", "In spite of", "Therefore"], correct: 2 },
  { id: 10, skill: "grammar", level: "B2", question: "Not only ___ late, but he also forgot his homework.", options: ["he was", "was he", "he is", "is he"], correct: 1 },
];

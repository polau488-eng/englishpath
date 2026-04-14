import type { DashboardStats, Lesson, PlacementQuestion, User } from "@/types";

export const MOCK_USER: User = {
  id: "user-1", email: "hoc.vien@example.com", name: "Nguyễn Minh Khoa",
  current_level: "A2", xp: 2340, streak: 12, streak_shield: 1,
  created_at: "2024-01-10T00:00:00Z", last_active: new Date().toISOString(), is_premium: false,
};

export const MOCK_DASHBOARD: DashboardStats = {
  total_xp: 2340, current_streak: 12, lessons_completed: 28, words_learned: 312,
  weekly_progress: [
    { day: "T2", xp: 120, lessons: 2 }, { day: "T3", xp: 85, lessons: 1 },
    { day: "T4", xp: 200, lessons: 3 }, { day: "T5", xp: 60, lessons: 1 },
    { day: "T6", xp: 175, lessons: 2 }, { day: "T7", xp: 310, lessons: 4 },
    { day: "CN", xp: 95, lessons: 1 },
  ],
  skill_breakdown: [
    { skill: "listening", score: 72, total: 100 }, { skill: "speaking", score: 45, total: 100 },
    { skill: "reading", score: 81, total: 100 },   { skill: "writing", score: 58, total: 100 },
    { skill: "grammar", score: 69, total: 100 },
  ],
  recent_lessons: [
    { id: "a2-listen-01", title: "Daily Routines",    skill: "listening", level: "A2", completed_at: "2024-03-10T10:00:00Z", score: 88 },
    { id: "a2-grammar-01",title: "Present Perfect",   skill: "grammar",   level: "A2", completed_at: "2024-03-09T15:30:00Z", score: 74 },
    { id: "a2-reading-01", title: "My Neighborhood",  skill: "reading",   level: "A2", completed_at: "2024-03-09T09:00:00Z", score: 92 },
    { id: "a2-speaking-01",title: "Shopping Dialogue",skill: "speaking",  level: "A2", completed_at: "2024-03-08T18:00:00Z", score: 61 },
  ],
  badges: [
    { id: "b1", name: "First Step",     description: "Hoàn thành bài học đầu tiên",       icon: "🎯", earned: true,  earned_at: "2024-01-10T00:00:00Z" },
    { id: "b2", name: "Week Warrior",   description: "Học 7 ngày liên tiếp",               icon: "🔥", earned: true,  earned_at: "2024-01-17T00:00:00Z" },
    { id: "b3", name: "Vocab Master",   description: "Học 300 từ vựng",                   icon: "📚", earned: true,  earned_at: "2024-02-15T00:00:00Z" },
    { id: "b4", name: "Grammar Guru",   description: "Hoàn thành ngữ pháp A1",            icon: "📐", earned: true,  earned_at: "2024-02-20T00:00:00Z" },
    { id: "b5", name: "Speed Listener", description: "Nghe ở tốc độ 1.5x",                icon: "⚡", earned: false },
    { id: "b6", name: "Essay Writer",   description: "Viết essay 200 từ",                  icon: "✍️", earned: false },
    { id: "b7", name: "Streak Legend",  description: "Học 30 ngày liên tiếp",              icon: "💎", earned: false },
    { id: "b8", name: "B2 Graduate",    description: "Hoàn thành lộ trình B2",             icon: "🏆", earned: false },
  ],
  level_progress: { level: "A2", lessons_completed: 28, lessons_total: 80, percentage: 35 },
};

export const MOCK_LESSONS: Lesson[] = [
  {
    id: "a1-listen-01", title: "Hello & Goodbye", description: "Nghe và luyện tập các câu chào hỏi cơ bản.",
    level: "A1", skill: "listening", duration_minutes: 15, xp_reward: 60, order: 1, status: "completed",
    content: {
      intro: "Học cách chào hỏi là bước đầu tiên. Nghe và nhắc lại từng câu.",
      sections: [{ type: "audio", content: "Listen to the greeting conversation.", exercises: [
        { id: "e1", type: "multiple_choice", question: "What does 'goodbye' mean?", options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"], correct_answer: "Tạm biệt", explanation: "'Goodbye' = 'Tạm biệt' — dùng khi chia tay." },
        { id: "e2", type: "true_false", question: "We say 'hello' when we leave.", options: ["True", "False", "Not Given"], correct_answer: "False", explanation: "'Hello' khi gặp mặt, 'Goodbye' khi chia tay." },
      ]}],
      vocabulary: [
        { word: "hello",     ipa: "/həˈloʊ/",   meaning_vi: "xin chào",  example: "Hello! My name is Tom." },
        { word: "goodbye",   ipa: "/ˌɡʊdˈbaɪ/", meaning_vi: "tạm biệt", example: "Goodbye! See you tomorrow." },
        { word: "thank you", ipa: "/θæŋk juː/",  meaning_vi: "cảm ơn",   example: "Thank you very much!" },
        { word: "please",    ipa: "/pliːz/",     meaning_vi: "làm ơn",   example: "Help me, please?" },
      ],
    },
  },
  {
    id: "a1-grammar-01", title: "To Be — am / is / are", description: "Nắm vững động từ 'to be' — nền tảng tiếng Anh.",
    level: "A1", skill: "grammar", duration_minutes: 20, xp_reward: 70, order: 2, status: "completed",
    content: {
      intro: "Đây là bài học nền tảng quan trọng nhất. Không có 'to be' là câu sai!",
      sections: [{ type: "exercise", content: "Practice to be.", exercises: [
        { id: "e3", type: "multiple_choice", question: "She ___ a doctor.", options: ["am", "is", "are", "be"], correct_answer: "is", explanation: "She/He/It → 'is'. I → 'am'. You/We/They → 'are'." },
        { id: "e4", type: "multiple_choice", question: "We ___ students.", options: ["am", "is", "are", "be"], correct_answer: "are", explanation: "We/You/They → 'are'." },
        { id: "e5", type: "fill_blank", question: "I ___ a student.", options: [], correct_answer: "am", explanation: "I luôn dùng 'am'.", hint: "I + ___" },
      ]}],
      vocabulary: [
        { word: "student", ipa: "/ˈstjuːdənt/", meaning_vi: "học sinh",   example: "I am a student." },
        { word: "teacher", ipa: "/ˈtiːtʃər/",   meaning_vi: "giáo viên", example: "She is a teacher." },
        { word: "happy",   ipa: "/ˈhæpi/",       meaning_vi: "vui vẻ",    example: "We are happy." },
      ],
      grammar_note: {
        point: "To Be (am/is/are)",
        explanation: "Bắt buộc phải có trong câu tiếng Anh. Tương đương 'là/thì' tiếng Việt.",
        examples: ["I am a student.", "She is happy.", "They are teachers."],
        common_mistakes: ["❌ I student → ✅ I am a student", "❌ She happy → ✅ She is happy"],
      },
    },
  },
  {
    id: "a2-listen-01", title: "Daily Routines", description: "Nghe về thói quen buổi sáng và luyện từ vựng tần suất.",
    level: "A2", skill: "listening", duration_minutes: 20, xp_reward: 80, order: 1, status: "completed",
    content: {
      intro: "Nghe Sarah kể về lịch trình buổi sáng và học từ vựng về thói quen hàng ngày.",
      sections: [{ type: "audio", content: "Listen to Sarah's morning routine.", exercises: [
        { id: "e8", type: "multiple_choice", question: "What time does Sarah wake up?", options: ["6:00", "6:30", "7:00", "7:30"], correct_answer: "6:30", explanation: "'Half past six' = 6:30." },
        { id: "e9", type: "fill_blank", question: "She ______ (go) to the gym every morning.", options: [], correct_answer: "goes", explanation: "Present Simple với she: go → goes.", hint: "go → go_s" },
        { id: "e10", type: "true_false", question: "Sarah takes the bus to work.", options: ["True", "False", "Not Given"], correct_answer: "Not Given", explanation: "Bài không đề cập phương tiện đi làm." },
      ]}],
      vocabulary: [
        { word: "routine",   ipa: "/ruːˈtiːn/",    meaning_vi: "thói quen hàng ngày", example: "I have a morning routine." },
        { word: "commute",   ipa: "/kəˈmjuːt/",    meaning_vi: "đi làm hàng ngày",   example: "My commute takes 45 min." },
        { word: "frequency", ipa: "/ˈfriːkwənsi/", meaning_vi: "tần suất",            example: "The frequency of exercise matters." },
      ],
      grammar_note: {
        point: "Adverbs of Frequency",
        explanation: "Đứng TRƯỚC động từ thường, SAU 'to be'.",
        examples: ["I always drink coffee.", "She is never late.", "We usually eat at 7."],
        common_mistakes: ["❌ I drink always coffee → ✅ I always drink coffee"],
      },
    },
  },
  {
    id: "a2-grammar-01", title: "Present Perfect", description: "Hiểu và dùng thì hiện tại hoàn thành đúng cách.",
    level: "A2", skill: "grammar", duration_minutes: 25, xp_reward: 100, order: 2, status: "completed",
    content: {
      intro: "Present Perfect là thì người Việt hay nhầm nhất. Bài này giải thích rõ ràng từng trường hợp.",
      sections: [{ type: "exercise", content: "Practice Present Perfect.", exercises: [
        { id: "e11", type: "multiple_choice", question: "Câu nào ĐÚNG?", options: ["I have seen this film yesterday.", "I saw this film yesterday.", "I have see this film.", "I have saw this film."], correct_answer: "I saw this film yesterday.", explanation: "Khi có 'yesterday' → Past Simple." },
        { id: "e12", type: "fill_blank", question: "She ______ to Japan twice. (visit)", options: [], correct_answer: "has visited", explanation: "She → has + visited (V3).", hint: "has + V3" },
        { id: "e13", type: "multiple_choice", question: "Have you ______ tried pho?", options: ["ever", "never", "already", "yet"], correct_answer: "ever", explanation: "'Ever' dùng trong câu hỏi kinh nghiệm." },
      ]}],
      vocabulary: [
        { word: "experience", ipa: "/ɪkˈspɪərɪəns/", meaning_vi: "kinh nghiệm",  example: "Have you ever experienced this?" },
        { word: "recently",   ipa: "/ˈriːsntli/",     meaning_vi: "gần đây",      example: "Have you seen any films recently?" },
        { word: "already",    ipa: "/ɔːlˈredi/",       meaning_vi: "đã rồi",       example: "I have already finished." },
        { word: "yet",        ipa: "/jɛt/",             meaning_vi: "chưa (cuối câu)", example: "Have you eaten yet?" },
      ],
      grammar_note: {
        point: "Present Perfect vs Past Simple",
        explanation: "Thời điểm cụ thể (yesterday, in 2020) → Past Simple. Không có thời điểm / kinh nghiệm → Present Perfect.",
        examples: ["I have visited Paris. (kinh nghiệm)", "I visited Paris in 2022. (cụ thể → Past Simple)"],
        common_mistakes: ["❌ I have gone there yesterday → ✅ I went there yesterday", "❌ Did you ever try? → ✅ Have you ever tried?"],
      },
    },
  },
  {
    id: "a2-reading-01", title: "My Neighborhood", description: "Đọc bài mô tả khu phố và luyện True/False/Not Given.",
    level: "A2", skill: "reading", duration_minutes: 20, xp_reward: 75, order: 3, status: "completed",
    content: {
      intro: "Đọc bài viết của Emma và trả lời câu hỏi. Chú ý phân biệt True/False/Not Given.",
      sections: [{ type: "text", content: "I live in a small but lively neighborhood. There is a farmers' market every Saturday. The best thing about my neighborhood is the sense of community — everyone knows each other.", exercises: [
        { id: "e14", type: "true_false", question: "The farmers' market opens every day.", options: ["True", "False", "Not Given"], correct_answer: "False", explanation: "Text says 'every Saturday', not every day." },
        { id: "e15", type: "multiple_choice", question: "What is the BEST thing about the neighborhood?", options: ["The park", "The cafés", "The sense of community", "The library"], correct_answer: "The sense of community", explanation: "Emma says 'The best thing is the sense of community'." },
      ]}],
      vocabulary: [
        { word: "lively",    ipa: "/ˈlaɪvli/",     meaning_vi: "sôi động",  example: "The market is lively." },
        { word: "community", ipa: "/kəˈmjuːnɪti/",  meaning_vi: "cộng đồng", example: "Strong sense of community." },
        { word: "regularly", ipa: "/ˈreɡjələli/",   meaning_vi: "thường xuyên", example: "I visit regularly." },
      ],
    },
  },
  {
    id: "a2-speaking-01", title: "Shopping Dialogue", description: "Luyện nói khi mua sắm — hỏi giá, thương lượng.",
    level: "A2", skill: "speaking", duration_minutes: 20, xp_reward: 90, order: 4, status: "in_progress",
    content: {
      intro: "Luyện các câu giao tiếp khi mua sắm. Nghe → lặp lại → ghi âm để kiểm tra.",
      sections: [{ type: "exercise", content: "Practice shopping phrases.", exercises: [
        { id: "e16", type: "multiple_choice", question: "Cách hỏi giá tự nhiên nhất là?", options: ["What is the cost?", "How much does this cost?", "What price is this?", "How many money?"], correct_answer: "How much does this cost?", explanation: "'How much does it cost?' là tự nhiên nhất." },
        { id: "e17", type: "fill_blank", question: "Could you give me a ______? (giảm giá)", options: [], correct_answer: "discount", explanation: "'Could you give me a discount?' — câu lịch sự xin giảm giá.", hint: "dis___ount" },
      ]}],
      vocabulary: [
        { word: "bargain",  ipa: "/ˈbɑːɡɪn/",    meaning_vi: "món hời",   example: "That was a real bargain!" },
        { word: "receipt",  ipa: "/rɪˈsiːt/",     meaning_vi: "hóa đơn",  example: "Can I have a receipt?" },
        { word: "discount", ipa: "/ˈdɪskaʊnt/",   meaning_vi: "giảm giá", example: "Is there a discount?" },
        { word: "exchange", ipa: "/ɪksˈtʃeɪndʒ/", meaning_vi: "đổi hàng", example: "I'd like to exchange this." },
      ],
    },
  },
  {
    id: "a2-writing-01", title: "Email Writing Basics", description: "Viết email đơn giản — cảm ơn, xin lỗi, yêu cầu.",
    level: "A2", skill: "writing", duration_minutes: 30, xp_reward: 110, order: 5, status: "available",
    content: {
      intro: "Học cách viết email tiếng Anh chuẩn từ cách mở đầu đến kết thúc.",
      sections: [{ type: "exercise", content: "Practice email writing.", exercises: [
        { id: "e18", type: "multiple_choice", question: "Email kết thúc lịch sự với người lạ dùng:", options: ["Best regards,", "Love,", "Cheers,", "Hey!"], correct_answer: "Best regards,", explanation: "'Best regards' hoặc 'Yours sincerely' dùng khi kết thư trang trọng." },
        { id: "e19", type: "true_false", question: "'Dear Mr. John' là cách mở email đúng.", options: ["True", "False", "Not Given"], correct_answer: "False", explanation: "Sai! Phải dùng họ: 'Dear Mr. Smith'. Tên: 'Dear John'." },
      ]}],
      vocabulary: [
        { word: "sincerely",  ipa: "/sɪnˈsɪərli/",  meaning_vi: "trân trọng", example: "Yours sincerely, Tom" },
        { word: "regarding",  ipa: "/rɪˈɡɑːrdɪŋ/",  meaning_vi: "về việc",    example: "Regarding your request..." },
        { word: "apologize",  ipa: "/əˈpɒlədʒaɪz/", meaning_vi: "xin lỗi",   example: "I apologize for the delay." },
        { word: "appreciate", ipa: "/əˈpriːʃɪeɪt/", meaning_vi: "trân trọng", example: "I appreciate your help." },
      ],
      grammar_note: {
        point: "Email Structure",
        explanation: "Greeting → Opening → Body → Closing → Signature.",
        examples: ["Dear Mr. Smith,", "I am writing to enquire about...", "Best regards, [Name]"],
        common_mistakes: ["❌ Dear Mr. John → ✅ Dear Mr. Smith", "❌ Best regard → ✅ Best regards"],
      },
    },
  },
  {
    id: "b1-grammar-01", title: "Conditional Sentences", description: "Câu điều kiện loại 1 và 2.",
    level: "B1", skill: "grammar", duration_minutes: 30, xp_reward: 130, order: 1, status: "locked",
    content: {
      intro: "Câu điều kiện là cấu trúc phổ biến. Bài này yêu cầu hoàn thành A2.",
      sections: [{ type: "exercise", content: "Practice conditional sentences.", exercises: [
        { id: "e20", type: "multiple_choice", question: "If it ______ tomorrow, we cancel the trip.", options: ["rains", "rained", "will rain", "rain"], correct_answer: "rains", explanation: "Type 1: If + Present Simple, will + V." },
        { id: "e21", type: "multiple_choice", question: "If I ______ rich, I would travel.", options: ["am", "was", "were", "be"], correct_answer: "were", explanation: "Type 2: If + Past Simple (were for all subjects in formal), would + V." },
      ]}],
      vocabulary: [
        { word: "conditional",  ipa: "/kənˈdɪʃənəl/", meaning_vi: "điều kiện",  example: "A conditional clause uses 'if'." },
        { word: "hypothesis",   ipa: "/haɪˈpɒθɪsɪs/", meaning_vi: "giả thuyết", example: "This is just a hypothesis." },
      ],
      grammar_note: {
        point: "Conditional Type 1 vs Type 2",
        explanation: "Loại 1 = thực tế có thể xảy ra. Loại 2 = không có thật, giả định.",
        examples: ["Type 1: If you study hard, you will pass.", "Type 2: If I had wings, I would fly."],
        common_mistakes: ["❌ If it will rain → ✅ If it rains", "❌ If I would have → ✅ If I had"],
      },
    },
  },
  {
    id: "b1-writing-01", title: "Opinion Essay", description: "Viết bài luận ý kiến — cấu trúc TEEL và discourse markers.",
    level: "B1", skill: "writing", duration_minutes: 35, xp_reward: 140, order: 2, status: "locked",
    content: {
      intro: "Học cách viết bài luận B1 theo cấu trúc rõ ràng. Yêu cầu hoàn thành A2.",
      sections: [{ type: "exercise", content: "Practice essay writing.", exercises: [
        { id: "e22", type: "multiple_choice", question: "Từ nào dùng để đưa ra điểm phản bác?", options: ["Furthermore", "However", "Therefore", "In addition"], correct_answer: "However", explanation: "'However' = tuy nhiên — chuyển sang ý đối lập." },
      ]}],
      vocabulary: [
        { word: "furthermore",  ipa: "/ˈfɜːðəmɔːr/",    meaning_vi: "hơn nữa",    example: "Furthermore, studies show..." },
        { word: "however",      ipa: "/haʊˈɛvər/",       meaning_vi: "tuy nhiên",  example: "However, not all agree." },
        { word: "consequently", ipa: "/ˈkɒnsɪkwəntli/", meaning_vi: "do đó",      example: "Consequently, prices rose." },
        { word: "nevertheless", ipa: "/ˌnɛvəðəˈlɛs/",   meaning_vi: "mặc dù vậy", example: "Nevertheless, they succeeded." },
      ],
      grammar_note: {
        point: "Essay Structure (TEEL)",
        explanation: "Topic sentence + Evidence + Explanation + Link back cho mỗi đoạn thân.",
        examples: ["Topic: Social media has benefits.", "Evidence: Studies show 70% of users...", "Link: Therefore, it is clear that..."],
        common_mistakes: ["❌ Thiếu topic sentence", "❌ Không dùng discourse markers để kết nối"],
      },
    },
  },
  {
    id: "b2-grammar-01", title: "Advanced Structures", description: "Inversion, cleft sentences, subjunctive nâng cao.",
    level: "B2", skill: "grammar", duration_minutes: 35, xp_reward: 160, order: 1, status: "locked",
    content: {
      intro: "Các cấu trúc nâng cao B2 — cần nắm vững để đạt IELTS 7.0+.",
      sections: [{ type: "exercise", content: "Practice advanced structures.", exercises: [
        { id: "e23", type: "multiple_choice", question: "Not only ______ late, but he forgot his work.", options: ["he was", "was he", "he is", "is he"], correct_answer: "was he", explanation: "Inversion sau 'Not only': Not only + was he + late." },
        { id: "e24", type: "fill_blank", question: "It was Sarah ______ found the solution.", options: [], correct_answer: "who", explanation: "Cleft sentence: It + was + người + who + verb.", hint: "'who' cho người" },
      ]}],
      vocabulary: [
        { word: "inversion",   ipa: "/ɪnˈvɜːrʒən/",  meaning_vi: "đảo ngữ",          example: "Never have I seen such beauty." },
        { word: "subjunctive", ipa: "/səbˈdʒʌŋktɪv/", meaning_vi: "lối giả định",     example: "I suggest that he be present." },
        { word: "cleft",       ipa: "/klɛft/",          meaning_vi: "câu tách (cấu trúc)", example: "It was Tom who broke it." },
      ],
      grammar_note: {
        point: "Emphasis Structures (B2)",
        explanation: "Đảo ngữ và câu tách dùng để nhấn mạnh — phổ biến trong văn học thuật và IELTS 7+.",
        examples: ["Never have I seen such a film.", "It was the price that surprised me."],
        common_mistakes: ["❌ Not only he was late → ✅ Not only was he late"],
      },
    },
  },
];

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  { id: 1,  skill: "grammar",    level: "A1", question: "She ___ a teacher.",           options: ["am","is","are","be"],            correct: 1 },
  { id: 2,  skill: "grammar",    level: "A1", question: "I ___ to school every day.",   options: ["go","goes","going","gone"],      correct: 0 },
  { id: 3,  skill: "vocabulary", level: "A1", question: "What does 'happy' mean?",      options: ["Buồn","Tức giận","Vui vẻ","Mệt mỏi"], correct: 2 },
  { id: 4,  skill: "grammar",    level: "A2", question: "I ___ Paris in 2019.",         options: ["have visited","visited","visit","am visiting"], correct: 1 },
  { id: 5,  skill: "grammar",    level: "A2", question: "She ___ here for 3 years.",    options: ["lived","lives","has lived","is living"], correct: 2 },
  { id: 6,  skill: "vocabulary", level: "A2", question: "I need to ___ my report.",     options: ["finish","finished","finishing","finishes"], correct: 0 },
  { id: 7,  skill: "grammar",    level: "B1", question: "If I ___ more time, I would learn.", options: ["have","had","having","has"], correct: 1 },
  { id: 8,  skill: "grammar",    level: "B1", question: "The report ___ by the manager yesterday.", options: ["wrote","was written","has written","is written"], correct: 1 },
  { id: 9,  skill: "vocabulary", level: "B1", question: "'Despite the rain, they continued.' — 'Despite' means:", options: ["Because of","Although","In spite of","Therefore"], correct: 2 },
  { id: 10, skill: "grammar",    level: "B2", question: "Not only ___ late, but he forgot too.", options: ["he was","was he","he is","is he"], correct: 1 },
];

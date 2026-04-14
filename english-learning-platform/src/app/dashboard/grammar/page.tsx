"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { LevelBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Level } from "@/types";

const GRAMMAR_POINTS = [
  {
    level: "A1" as Level, id: "g1",
    title: "To Be — am / is / are",
    explanation: "Động từ 'to be' trong tiếng Anh tương đương với 'là/thì' trong tiếng Việt, nhưng bắt buộc phải có trong câu.",
    formula: "S + am/is/are + (noun/adjective)",
    examples: ["I am a student.", "She is happy.", "They are teachers.", "It is cold today."],
    common_mistakes: ["❌ I student → ✅ I am a student", "❌ She happy → ✅ She is happy"],
    exercises: [
      { q: "She ___ a doctor.", opts: ["am", "is", "are", "be"], correct: 1 },
      { q: "We ___ students.", opts: ["am", "is", "are", "be"], correct: 2 },
    ],
    done: true,
  },
  {
    level: "A1" as Level, id: "g2",
    title: "Present Simple",
    explanation: "Dùng để nói về thói quen, sự thật hiển nhiên, và lịch trình cố định. Với he/she/it phải thêm -s hoặc -es.",
    formula: "S + V(s/es) / S + do/does + not + V",
    examples: ["I work every day.", "She goes to school.", "They don't like coffee."],
    common_mistakes: ["❌ She work → ✅ She works", "❌ He don't eat meat → ✅ He doesn't eat meat"],
    exercises: [
      { q: "He ___ (go) to work by bus.", opts: ["go", "goes", "going", "gone"], correct: 1 },
    ],
    done: true,
  },
  {
    level: "A2" as Level, id: "g3",
    title: "Past Simple",
    explanation: "Dùng để nói về hành động đã xảy ra và kết thúc trong quá khứ, thường đi kèm với yesterday, last week, ago...",
    formula: "S + V(ed) / S + did + not + V",
    examples: ["I visited Hanoi last year.", "She didn't come to the party.", "Did you see that film?"],
    common_mistakes: ["❌ I have seen it yesterday → ✅ I saw it yesterday", "❌ She didn't went → ✅ She didn't go"],
    exercises: [
      { q: "They ___ (watch) a movie last night.", opts: ["watch", "watches", "watched", "watching"], correct: 2 },
    ],
    done: true,
  },
  {
    level: "A2" as Level, id: "g4",
    title: "Present Perfect",
    explanation: "Dùng cho kinh nghiệm, kết quả liên quan đến hiện tại, và hành động vừa xảy ra. KHÔNG dùng với mốc thời gian cụ thể.",
    formula: "S + have/has + V(past participle)",
    examples: ["I have visited Paris. (kinh nghiệm)", "She has just called. (vừa xảy ra)", "Have you ever tried sushi?"],
    common_mistakes: ["❌ I have gone there yesterday → ✅ I went there yesterday", "❌ Did you ever try it? → ✅ Have you ever tried it?"],
    exercises: [
      { q: "I ___ never ___ sushi before.", opts: ["have/eaten", "had/eat", "have/eat", "did/eat"], correct: 0 },
    ],
    done: false,
  },
  {
    level: "B1" as Level, id: "g5",
    title: "Câu điều kiện loại 1 & 2",
    explanation: "Loại 1: điều kiện có thể xảy ra (thực tế). Loại 2: điều kiện không thực tế hoặc khó xảy ra ở hiện tại.",
    formula: "Type 1: If + Present Simple, will + V  |  Type 2: If + Past Simple, would + V",
    examples: ["If it rains, I will stay home. (có thể mưa)", "If I had a car, I would drive to work. (không có xe)"],
    common_mistakes: ["❌ If I will have time → ✅ If I have time", "❌ If I would know → ✅ If I knew"],
    exercises: [
      { q: "If she ___ harder, she would pass the exam.", opts: ["study", "studied", "will study", "studies"], correct: 1 },
    ],
    done: false,
  },
  {
    level: "B1" as Level, id: "g6",
    title: "Passive Voice — Câu bị động",
    explanation: "Dùng khi hành động quan trọng hơn người thực hiện, hoặc khi không biết ai thực hiện.",
    formula: "S + am/is/are/was/were + V(past participle) + (by + agent)",
    examples: ["The book was written by Hemingway.", "English is spoken in many countries.", "The window has been broken."],
    common_mistakes: ["❌ The letter was wrote by him → ✅ The letter was written by him"],
    exercises: [],
    done: false,
  },
  {
    level: "B2" as Level, id: "g7",
    title: "Inversion — Đảo ngữ",
    explanation: "Đảo ngữ được dùng để nhấn mạnh, thường xuất hiện trong văn viết trang trọng và đề thi IELTS/TOEIC.",
    formula: "Negative adverb + Auxiliary + S + V",
    examples: ["Never have I seen such beauty.", "Not only did she win, but she also broke the record.", "Rarely does he make a mistake."],
    common_mistakes: ["❌ Never I have seen → ✅ Never have I seen"],
    exercises: [],
    done: false,
  },
];

export default function GrammarPage() {
  const [selectedLevel, setSelectedLevel] = useState<Level | "all">("all");
  const [activeId, setActiveId] = useState<string | null>("g1");
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const filtered = GRAMMAR_POINTS.filter((g) => selectedLevel === "all" || g.level === selectedLevel);
  const active = GRAMMAR_POINTS.find((g) => g.id === activeId);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Ngữ pháp" subtitle="Học ngữ pháp theo cấp độ, có giải thích bằng tiếng Việt" />

      <div className="p-6 max-w-6xl mx-auto w-full">
        {/* Level filter */}
        <div className="flex gap-2 mb-6">
          {(["all", "A1", "A2", "B1", "B2"] as const).map((lv) => (
            <button
              key={lv}
              onClick={() => setSelectedLevel(lv)}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                selectedLevel === lv ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              )}
            >{lv === "all" ? "Tất cả" : lv}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grammar list */}
          <div className="space-y-2">
            {filtered.map((g) => (
              <button
                key={g.id}
                onClick={() => setActiveId(g.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  activeId === g.id
                    ? "bg-brand-50 border-brand-300 shadow-sm"
                    : "bg-white border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <LevelBadge level={g.level} />
                  {g.done && <span className="text-xs text-green-600 font-medium">✓ Xong</span>}
                </div>
                <p className={cn("text-sm font-semibold", activeId === g.id ? "text-brand-800" : "text-gray-900")}>
                  {g.title}
                </p>
              </button>
            ))}
          </div>

          {/* Grammar detail */}
          {active && (
            <div className="lg:col-span-2 space-y-4 animate-fade-up">
              <div className="card p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <LevelBadge level={active.level} />
                    <h2 className="text-xl font-bold text-gray-900 mt-2">{active.title}</h2>
                  </div>
                  {active.done && (
                    <span className="badge bg-green-100 text-green-700">✓ Đã học</span>
                  )}
                </div>

                {/* Explanation */}
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-blue-800 mb-1">💡 Giải thích</p>
                  <p className="text-sm text-blue-700">{active.explanation}</p>
                </div>

                {/* Formula */}
                <div className="bg-gray-900 rounded-xl p-4 mb-4 font-mono text-sm text-green-400">
                  📐 {active.formula}
                </div>

                {/* Examples */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">✅ Ví dụ</p>
                  <ul className="space-y-1.5">
                    {active.examples.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-brand-500 mt-0.5 flex-shrink-0">→</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common mistakes */}
                {active.common_mistakes.length > 0 && (
                  <div className="bg-red-50 rounded-xl p-4 mb-4">
                    <p className="text-sm font-semibold text-red-800 mb-2">⚠️ Lỗi người Việt hay mắc</p>
                    <ul className="space-y-1">
                      {active.common_mistakes.map((m, i) => (
                        <li key={i} className="text-sm text-red-700">{m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Exercises */}
                {active.exercises.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">🎯 Luyện tập nhanh</p>
                    {active.exercises.map((ex, i) => {
                      const key = `${active.id}-${i}`;
                      const picked = answers[key] ?? null;
                      return (
                        <div key={i} className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-800 mb-3">{ex.q}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {ex.opts.map((opt, j) => (
                              <button
                                key={j}
                                disabled={picked !== null}
                                onClick={() => setAnswers({ ...answers, [key]: j })}
                                className={cn(
                                  "px-3 py-2 rounded-lg text-sm border-2 font-medium transition-all",
                                  picked === null
                                    ? "bg-white border-gray-200 hover:border-brand-400 text-gray-700"
                                    : j === ex.correct
                                      ? "bg-green-50 border-green-400 text-green-800"
                                      : picked === j
                                        ? "bg-red-50 border-red-400 text-red-800"
                                        : "bg-gray-50 border-gray-100 text-gray-400"
                                )}
                              >{opt}</button>
                            ))}
                          </div>
                          {picked !== null && (
                            <p className={cn("text-sm mt-2 font-medium", picked === ex.correct ? "text-green-700" : "text-red-700")}>
                              {picked === ex.correct ? "✅ Chính xác!" : `❌ Đáp án đúng: ${ex.opts[ex.correct]}`}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

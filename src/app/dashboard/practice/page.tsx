"use client";
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

const DAILY_EXERCISES = [
  { id: "d1", type: "Từ vựng", title: "8 từ cần ôn tập hôm nay", desc: "Spaced repetition — đúng lịch ôn", icon: "🧠", xp: 40, done: false, link: "/dashboard/vocabulary" },
  { id: "d2", type: "Ngữ pháp", title: "Present Perfect drill", desc: "10 câu bài tập ngữ pháp nhanh", icon: "📐", xp: 30, done: true,  link: "/dashboard/grammar" },
  { id: "d3", type: "Nghe", title: "Mini listening: Daily routines", desc: "Nghe 2 phút, trả lời 3 câu hỏi", icon: "🎧", xp: 50, done: false, link: "/lesson/l-a2-01" },
  { id: "d4", type: "Đọc", title: "Reading challenge: 5 phút", desc: "Đọc 1 đoạn ngắn và trả lời câu hỏi", icon: "📖", xp: 35, done: false, link: "/lesson/l-a2-03" },
  { id: "d5", type: "Viết", title: "Sentence building practice", desc: "Sắp xếp từ thành câu hoàn chỉnh", icon: "✍️", xp: 25, done: true,  link: "/dashboard/writing" },
];

const CHALLENGES = [
  { id: "c1", title: "Streak 30 ngày", desc: "Học mỗi ngày trong 30 ngày liên tiếp", progress: 12, total: 30, icon: "🔥", reward: "200 XP + Badge" },
  { id: "c2", title: "Từ vựng Master", desc: "Học 500 từ vựng", progress: 312, total: 500, icon: "📚", reward: "300 XP + Badge" },
  { id: "c3", title: "Grammar Pro", desc: "Hoàn thành tất cả bài ngữ pháp A2", progress: 4, total: 8, icon: "📐", reward: "150 XP" },
];

export default function PracticePage() {
  const [tab, setTab] = useState<"daily" | "challenges">("daily");
  const doneCount = DAILY_EXERCISES.filter((e) => e.done).length;
  const totalXP = DAILY_EXERCISES.filter((e) => e.done).reduce((s, e) => s + e.xp, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Luyện tập" subtitle="Bài tập hàng ngày và thử thách dài hạn" />

      <div className="p-6 max-w-4xl mx-auto w-full">
        {/* Daily summary */}
        <div className="card p-5 mb-6 flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Mục tiêu hôm nay</span>
              <span className="text-brand-600 font-bold text-sm">{doneCount}/{DAILY_EXERCISES.length} hoàn thành · {totalXP} XP</span>
            </div>
            <Progress value={doneCount} max={DAILY_EXERCISES.length} size="lg" />
          </div>
          <div className="text-center hidden sm:block px-4 border-l border-gray-100">
            <p className="text-3xl font-bold text-orange-500">🔥 12</p>
            <p className="text-xs text-gray-500">ngày streak</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 bg-gray-100 p-1 rounded-xl w-fit">
          {(["daily", "challenges"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn("px-5 py-2 rounded-lg text-sm font-medium transition-all",
                tab === t ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              )}>
              {t === "daily" ? "📅 Hôm nay" : "🏆 Thử thách"}
            </button>
          ))}
        </div>

        {tab === "daily" && (
          <div className="space-y-3 animate-stagger">
            {DAILY_EXERCISES.map((ex) => (
              <Link key={ex.id} href={ex.link}>
                <div className={cn("card p-5 flex items-center gap-4 transition-all",
                  ex.done ? "opacity-70" : "card-hover"
                )}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0",
                    ex.done ? "bg-green-50" : "bg-gray-50"
                  )}>
                    {ex.done ? "✅" : ex.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="badge bg-gray-100 text-gray-600 text-xs">{ex.type}</span>
                    </div>
                    <p className={cn("font-semibold text-sm", ex.done ? "text-gray-400 line-through" : "text-gray-900")}>
                      {ex.title}
                    </p>
                    <p className="text-xs text-gray-500">{ex.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={cn("text-sm font-bold", ex.done ? "text-gray-300" : "text-brand-600")}>+{ex.xp} XP</p>
                    {!ex.done && <p className="text-xs text-gray-400 mt-0.5">Bắt đầu →</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === "challenges" && (
          <div className="space-y-4 animate-stagger">
            {CHALLENGES.map((ch) => (
              <div key={ch.id} className="card p-5">
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{ch.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-0.5">{ch.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{ch.desc}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span>{ch.progress.toLocaleString()} / {ch.total.toLocaleString()}</span>
                      <span className="text-brand-600 font-medium">{Math.round((ch.progress/ch.total)*100)}%</span>
                    </div>
                    <Progress value={ch.progress} max={ch.total} size="md" />
                    <p className="text-xs text-amber-600 mt-2">🏆 Phần thưởng: {ch.reward}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

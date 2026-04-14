"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Progress } from "@/components/ui/Progress";
import { cn } from "@/lib/utils";

const MOCK_TESTS = [
  { id: "ielts-r1", name: "IELTS Reading — Test 1", type: "IELTS", skill: "reading",  duration: 60, questions: 40, difficulty: "B2", done: true,  score: 32 },
  { id: "ielts-l1", name: "IELTS Listening — Test 1", type: "IELTS", skill: "listening", duration: 30, questions: 40, difficulty: "B2", done: false, score: null },
  { id: "toeic-1",  name: "TOEIC Full Test — Set 1", type: "TOEIC", skill: "mixed",    duration: 120, questions: 200, difficulty: "B1", done: false, score: null },
  { id: "ielts-w1", name: "IELTS Writing Task 2",    type: "IELTS", skill: "writing",  duration: 40, questions: 1,  difficulty: "B2", done: false, score: null },
  { id: "mini-1",   name: "Mini Test A2 — Tổng hợp", type: "Mini",  skill: "mixed",    duration: 20, questions: 25, difficulty: "A2", done: true,  score: 22 },
  { id: "mini-2",   name: "Mini Test B1 — Ngữ pháp",  type: "Mini",  skill: "grammar",  duration: 15, questions: 20, difficulty: "B1", done: false, score: null },
];

const skillIcon: Record<string, string> = {
  reading: "📖", listening: "🎧", writing: "✍️", grammar: "📐", mixed: "🎯",
};

export default function MockTestPage() {
  const [filter, setFilter] = useState<"all" | "IELTS" | "TOEIC" | "Mini">("all");
  const filtered = MOCK_TESTS.filter((t) => filter === "all" || t.type === filter);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Thi thử" subtitle="Đề IELTS, TOEIC và Mini Test có chấm điểm tự động" />

      <div className="p-6 max-w-4xl mx-auto w-full">
        {/* Banner */}
        <div className="card p-5 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 flex items-center gap-4">
          <span className="text-4xl">📝</span>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-0.5">Kết quả gần nhất: IELTS Reading Test 1</h3>
            <p className="text-sm text-blue-700">32/40 câu đúng · Band 7.0 ước tính · Ngày 08/03/2024</p>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-3xl font-bold text-blue-700">7.0</p>
            <p className="text-xs text-blue-500">Band ước tính</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-5">
          {(["all", "IELTS", "TOEIC", "Mini"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                filter === f ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              )}>
              {f === "all" ? "Tất cả" : f}
            </button>
          ))}
        </div>

        <div className="space-y-3 animate-stagger">
          {filtered.map((test) => (
            <div key={test.id} className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {skillIcon[test.skill]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{test.name}</h3>
                  <span className="badge bg-gray-100 text-gray-600 text-xs">{test.type}</span>
                  <span className="badge bg-blue-100 text-blue-700 text-xs">{test.difficulty}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>⏱ {test.duration} phút</span>
                  <span>❓ {test.questions} câu</span>
                  {test.done && test.score !== null && (
                    <>
                      <span>·</span>
                      <span className="text-green-600 font-medium">✓ {test.score}/{test.questions} ({Math.round((test.score/test.questions)*100)}%)</span>
                    </>
                  )}
                </div>
                {test.done && test.score !== null && (
                  <div className="mt-2">
                    <Progress value={test.score} max={test.questions} size="sm" barClassName="bg-green-500" />
                  </div>
                )}
              </div>
              <button className={cn(
                "text-sm font-medium px-4 py-2 rounded-xl flex-shrink-0 transition-all",
                test.done
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-brand-600 text-white hover:bg-brand-700 shadow-sm"
              )}>
                {test.done ? "Làm lại" : "Bắt đầu →"}
              </button>
            </div>
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-6 card p-5 border-dashed border-2 border-gray-200 text-center">
          <p className="text-gray-400 text-sm">🚀 Sắp ra mắt: IELTS Writing AI Checker — Chấm điểm Task 1 & Task 2 tự động với nhận xét chi tiết</p>
        </div>
      </div>
    </div>
  );
}

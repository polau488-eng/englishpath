"use client";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { LevelBadge } from "@/components/ui/Badge";
import { MOCK_LESSONS } from "@/lib/mock-data";

const readingLessons = MOCK_LESSONS.filter((l) => l.skill === "reading");

export default function ReadingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Kỹ năng Đọc" subtitle="Từ đoạn văn ngắn 50 từ đến bài IELTS 900 từ" />
      <div className="p-6 max-w-4xl mx-auto w-full">
        <div className="card p-5 mb-6 bg-emerald-50 border-emerald-100 flex items-center gap-4">
          <span className="text-4xl">📖</span>
          <div>
            <h3 className="font-bold text-emerald-900">Reading Lab</h3>
            <p className="text-sm text-emerald-700">Click tra từ ngay · Highlight & ghi chú · True/False/Not Given · Skimming & Scanning</p>
          </div>
        </div>
        <div className="space-y-3">
          {readingLessons.map((lesson) => (
            <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
              <div className="card p-5 card-hover flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">📖</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1"><LevelBadge level={lesson.level} /></div>
                  <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                </div>
                <div className="text-right flex-shrink-0 text-sm">
                  <p className="text-brand-600 font-bold">+{lesson.xp_reward} XP</p>
                  <p className="text-gray-400 text-xs mt-0.5">⏱ {lesson.duration_minutes} phút</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

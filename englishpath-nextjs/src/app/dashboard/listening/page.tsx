"use client";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { LevelBadge } from "@/components/ui/Badge";
import { MOCK_LESSONS } from "@/lib/mock-data";

const listeningLessons = MOCK_LESSONS.filter((l) => l.skill === "listening");

export default function ListeningPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Kỹ năng Nghe" subtitle="Từ hội thoại đơn giản đến podcast và tin tức" />
      <div className="p-6 max-w-4xl mx-auto w-full">
        <div className="card p-5 mb-6 bg-blue-50 border-blue-100 flex items-center gap-4">
          <span className="text-4xl">🎧</span>
          <div>
            <h3 className="font-bold text-blue-900">Listening Lab</h3>
            <p className="text-sm text-blue-700">Điều chỉnh tốc độ · Script song ngữ · Highlight từ theo thời gian thực</p>
          </div>
        </div>
        {listeningLessons.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-4xl block mb-3">🎧</span>
            <p>Chưa có bài nghe. Thêm bài học vào mock-data.ts để bắt đầu.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {listeningLessons.map((lesson) => (
              <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                <div className="card p-5 card-hover flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🎧</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1"><LevelBadge level={lesson.level} /></div>
                    <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">{lesson.description}</p>
                  </div>
                  <div className="text-right text-sm flex-shrink-0">
                    <p className="text-brand-600 font-bold">+{lesson.xp_reward} XP</p>
                    <p className="text-gray-400 text-xs mt-0.5">⏱ {lesson.duration_minutes} phút</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

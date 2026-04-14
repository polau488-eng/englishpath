"use client";
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { LevelBadge, SkillBadge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { MOCK_LESSONS } from "@/lib/mock-data";
import { SKILL_CONFIG, cn } from "@/lib/utils";
import type { Level, Skill } from "@/types";

const LEVELS: Level[] = ["A1", "A2", "B1", "B2"];
const SKILLS: { value: Skill | "all"; label: string }[] = [
  { value: "all",       label: "Tất cả" },
  { value: "listening", label: "Nghe" },
  { value: "speaking",  label: "Nói" },
  { value: "reading",   label: "Đọc" },
  { value: "writing",   label: "Viết" },
  { value: "grammar",   label: "Ngữ pháp" },
];

export default function LessonsPage() {
  const [selectedLevel, setSelectedLevel] = useState<Level | "all">("all");
  const [selectedSkill, setSelectedSkill] = useState<Skill | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = MOCK_LESSONS.filter((l) => {
    if (selectedLevel !== "all" && l.level !== selectedLevel) return false;
    if (selectedSkill !== "all" && l.skill !== selectedSkill) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const completedCount = MOCK_LESSONS.filter((l) => l.status === "completed").length;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Bài học" subtitle={`${completedCount}/${MOCK_LESSONS.length} bài đã hoàn thành`} />

      <div className="p-6 max-w-5xl mx-auto w-full">
        {/* Filter bar */}
        <div className="card p-4 mb-6 space-y-3">
          <input
            type="search"
            placeholder="🔍  Tìm kiếm bài học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedLevel("all")}
              className={cn("px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                selectedLevel === "all" ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              )}
            >Tất cả cấp</button>
            {LEVELS.map((lv) => (
              <button
                key={lv}
                onClick={() => setSelectedLevel(lv)}
                className={cn("px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                  selectedLevel === lv ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                )}
              >{lv}</button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {SKILLS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSelectedSkill(s.value as Skill | "all")}
                className={cn("px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                  selectedSkill === s.value ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                )}
              >
                {s.value !== "all" && SKILL_CONFIG[s.value as Skill].icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overall progress */}
        <div className="card p-4 mb-6 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium text-gray-700">Tiến độ tổng thể</span>
              <span className="text-brand-600 font-semibold">{Math.round((completedCount / MOCK_LESSONS.length) * 100)}%</span>
            </div>
            <Progress value={completedCount} max={MOCK_LESSONS.length} size="lg" />
          </div>
          <div className="text-center px-4 border-l border-gray-100">
            <p className="text-2xl font-bold text-brand-600">{completedCount}</p>
            <p className="text-xs text-gray-500">hoàn thành</p>
          </div>
        </div>

        {/* Lesson grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-4xl block mb-3">🔍</span>
            <p className="font-medium">Không tìm thấy bài học phù hợp</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-stagger">
            {filtered.map((lesson) => {
              const skillCfg = SKILL_CONFIG[lesson.skill];
              const isLocked = lesson.status === "locked";
              const isDone   = lesson.status === "completed";

              return (
                <Link key={lesson.id} href={isLocked ? "#" : `/lesson/${lesson.id}`}>
                  <div className={cn(
                    "card p-5 h-full transition-all",
                    isLocked ? "opacity-60 cursor-not-allowed" : "card-hover"
                  )}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn("skill-icon text-xl flex-shrink-0", skillCfg.bg)}>
                        {isDone ? "✅" : skillCfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{lesson.title}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <LevelBadge level={lesson.level} />
                          <SkillBadge skill={lesson.skill} />
                        </div>
                      </div>
                      {isLocked && <span className="text-gray-400 text-lg flex-shrink-0">🔒</span>}
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{lesson.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                      <span>⏱ {lesson.duration_minutes} phút</span>
                      <span className="text-brand-600 font-semibold">+{lesson.xp_reward} XP</span>
                      <span className={cn(
                        "font-medium",
                        isDone ? "text-green-600" : lesson.status === "in_progress" ? "text-blue-600" : "text-gray-500"
                      )}>
                        {isDone ? "✓ Xong" : lesson.status === "in_progress" ? "Đang học" : isLocked ? "Khóa" : "Chưa học"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

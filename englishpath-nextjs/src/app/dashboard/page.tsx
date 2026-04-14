"use client";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Progress } from "@/components/ui/Progress";
import { LevelBadge, SkillBadge } from "@/components/ui/Badge";
import { useAppStore } from "@/lib/store";
import { MOCK_DASHBOARD, MOCK_LESSONS } from "@/lib/mock-data";
import { SKILL_CONFIG, LEVEL_CONFIG, xpToLevel, getStreakEmoji, formatDuration } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Skill } from "@/types";

export default function DashboardPage() {
  const { user } = useAppStore();
  const stats = MOCK_DASHBOARD;
  const lvl = user ? xpToLevel(user.xp) : null;
  const today = new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit" });
  const continueLessons = MOCK_LESSONS.filter(l => l.status === "in_progress" || l.status === "available").slice(0, 3);

  return (
    <div className="flex flex-col min-h-full">
      <Header title={`Xin chào, ${user?.name.split(" ").pop()} 👋`} subtitle={today} />
      <div className="flex-1 p-6 space-y-6 animate-stagger">

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "XP hôm nay",      value: "245",                         sub: "+15% vs hôm qua", icon: "⚡", color: "text-brand-600",  bg: "bg-brand-50"  },
            { label: "Chuỗi học",        value: `${user?.streak ?? 0} ngày`,   sub: getStreakEmoji(user?.streak ?? 0) + " Tiếp tục!", icon: "🔥", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Bài hoàn thành",   value: String(stats.lessons_completed), sub: "tổng cộng", icon: "✅", color: "text-green-600",  bg: "bg-green-50"  },
            { label: "Từ vựng đã học",   value: String(stats.words_learned),   sub: "từ",         icon: "📚", color: "text-purple-600", bg: "bg-purple-50" },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left col */}
          <div className="lg:col-span-2 space-y-6">

            {/* Level progress */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="section-title">Tiến độ cấp độ</p>
                  <p className="section-subtitle">{LEVEL_CONFIG[user?.current_level ?? "A1"].label}</p>
                </div>
                <LevelBadge level={user?.current_level ?? "A1"} />
              </div>
              <Progress value={stats.level_progress.lessons_completed} max={stats.level_progress.lessons_total} size="lg" showLabel />
              <p className="text-xs text-gray-500 mt-2">
                {stats.level_progress.lessons_completed}/{stats.level_progress.lessons_total} bài ·{" "}
                còn {stats.level_progress.lessons_total - stats.level_progress.lessons_completed} bài để lên{" "}
                {LEVEL_CONFIG[user?.current_level ?? "A1"].next}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">Lv.{lvl?.level} · {user?.xp.toLocaleString()} XP</span>
                  <span className="text-gray-400">còn {lvl?.next.toLocaleString()} XP</span>
                </div>
                <Progress value={lvl?.progress ?? 0} barClassName="bg-accent-500" />
              </div>
            </div>

            {/* Weekly chart */}
            <div className="card p-5">
              <p className="section-title mb-4">Hoạt động tuần này</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={stats.weekly_progress} barSize={28}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: "#f3f4f6", radius: 4 } as object}
                    content={({ active, payload, label }) =>
                      active && payload?.length ? (
                        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-md">
                          <p className="font-semibold text-gray-700">{label}</p>
                          <p className="text-brand-600">{payload[0].value} XP</p>
                          <p className="text-gray-500">{(payload[0].payload as { lessons: number }).lessons} bài</p>
                        </div>
                      ) : null
                    }
                  />
                  <Bar dataKey="xp" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Continue learning */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="section-title">Tiếp tục học</p>
                <Link href="/dashboard/lessons" className="text-sm text-brand-600 font-medium hover:underline">Xem tất cả →</Link>
              </div>
              <div className="space-y-2">
                {continueLessons.map((lesson) => (
                  <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group">
                      <div className={`skill-icon ${SKILL_CONFIG[lesson.skill].bg}`}>
                        {SKILL_CONFIG[lesson.skill].icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate group-hover:text-brand-700">{lesson.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <SkillBadge skill={lesson.skill} />
                          <LevelBadge level={lesson.level} />
                          <span className="text-xs text-gray-400">{formatDuration(lesson.duration_minutes)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">+{lesson.xp_reward} XP</span>
                        {lesson.status === "in_progress" && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Đang học</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right col */}
          <div className="space-y-6">
            {/* Skill breakdown */}
            <div className="card p-5">
              <p className="section-title mb-4">Phân tích kỹ năng</p>
              <div className="space-y-3">
                {stats.skill_breakdown.map(({ skill, score }) => {
                  const cfg = SKILL_CONFIG[skill as Skill];
                  return (
                    <div key={skill}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span>{cfg.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{cfg.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{score}%</span>
                      </div>
                      <Progress value={score} size="sm"
                        barClassName={score >= 80 ? "bg-green-500" : score >= 60 ? "bg-brand-500" : score >= 40 ? "bg-amber-500" : "bg-red-400"}
                      />
                    </div>
                  );
                })}
              </div>
              <Link href="/placement-test" className="mt-4 block text-center text-sm text-brand-600 font-medium hover:underline">
                Làm bài kiểm tra lại →
              </Link>
            </div>

            {/* Badges */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="section-title">Huy hiệu</p>
                <span className="text-xs text-gray-400">{stats.badges.filter(b => b.earned).length}/{stats.badges.length}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {stats.badges.map((badge) => (
                  <div key={badge.id} title={`${badge.name}: ${badge.description}`}
                    className={`aspect-square rounded-xl flex items-center justify-center text-2xl cursor-default transition-all ${
                      badge.earned ? "bg-amber-50 border border-amber-200 hover:scale-110" : "bg-gray-100 grayscale opacity-40"
                    }`}>
                    {badge.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Daily goal */}
            <div className="card p-5">
              <p className="section-title mb-1">Mục tiêu hôm nay</p>
              <p className="text-xs text-gray-500 mb-3">Hoàn thành 3 bài để đạt mục tiêu</p>
              <div className="flex gap-2 mb-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`flex-1 h-2 rounded-full ${i <= 2 ? "bg-brand-500" : "bg-gray-200"}`} />
                ))}
              </div>
              <p className="text-xs text-gray-500 mb-3">2/3 bài · Còn 1 bài nữa! 🎯</p>
              <Link href="/dashboard/lessons" className="btn-primary w-full justify-center text-sm">
                Học ngay
              </Link>
            </div>

            {/* Leaderboard */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="section-title">Bảng xếp hạng</p>
                <span className="text-xs text-gray-400">Tuần này</span>
              </div>
              {[
                { rank: 1, name: "Trà My",    xp: 3420, you: false },
                { rank: 2, name: "Hoàng Nam", xp: 2890, you: false },
                { rank: 3, name: "Bạn",       xp: 2340, you: true  },
                { rank: 4, name: "Lan Anh",   xp: 2100, you: false },
              ].map((item) => (
                <div key={item.rank} className={`flex items-center gap-3 py-2 px-2 rounded-lg ${item.you ? "bg-brand-50" : ""}`}>
                  <span className="w-5 text-center text-sm font-bold">
                    {item.rank === 1 ? "🥇" : item.rank === 2 ? "🥈" : item.rank === 3 ? "🥉" : item.rank}
                  </span>
                  <span className={`flex-1 text-sm ${item.you ? "font-bold text-brand-700" : "text-gray-700"}`}>{item.name}</span>
                  <span className="text-xs font-semibold text-gray-500">{item.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

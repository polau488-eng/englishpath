"use client";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Progress } from "@/components/ui/Progress";
import { LevelBadge, SkillBadge } from "@/components/ui/Badge";
import { useAppStore } from "@/lib/store";
import { MOCK_DASHBOARD, MOCK_LESSONS } from "@/lib/mock-data";
import { LEVEL_CONFIG, SKILL_CONFIG, cn, getStreakEmoji, xpToLevel } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

export default function DashboardPage() {
  const { user } = useAppStore();
  const stats = MOCK_DASHBOARD;
  const lvl = user ? xpToLevel(user.xp) : null;
  const availableLessons = MOCK_LESSONS.filter((l) => l.status === "available" || l.status === "in_progress");
  const recentLessons = MOCK_LESSONS.filter((l) => l.status === "completed").slice(0, 3);

  const radarData = stats.skill_breakdown.map((s) => ({
    skill: SKILL_CONFIG[s.skill].label,
    score: s.score,
    fullMark: 100,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title={`Chào buổi sáng, ${user?.name.split(" ").pop()}! 👋`}
        subtitle="Hãy tiếp tục lộ trình học hôm nay"
      />

      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full animate-stagger">

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Streak hiện tại", value: `${stats.current_streak} ngày`, icon: getStreakEmoji(stats.current_streak), color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Tổng XP", value: stats.total_xp.toLocaleString(), icon: "⚡", color: "text-brand-600", bg: "bg-brand-50" },
            { label: "Bài đã học", value: stats.lessons_completed, icon: "✅", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Từ đã học", value: stats.words_learned, icon: "📚", color: "text-purple-600", bg: "bg-purple-50" },
          ].map((s) => (
            <div key={s.label} className="card p-5">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3", s.bg)}>
                {s.icon}
              </div>
              <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Level progress ── */}
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="section-title">Tiến độ cấp độ</h2>
                <p className="section-subtitle">
                  {stats.level_progress.lessons_completed}/{stats.level_progress.lessons_total} bài · Cấp {stats.level_progress.level}
                </p>
              </div>
              <LevelBadge level={stats.level_progress.level} />
            </div>

            {/* Level timeline */}
            <div className="flex items-center gap-2 mb-5">
              {(["A1", "A2", "B1", "B2"] as const).map((lv, i) => {
                const cfg = LEVEL_CONFIG[lv];
                const done = ["A1", "A2", "B1", "B2"].indexOf(user?.current_level ?? "A1") > i;
                const current = lv === user?.current_level;
                return (
                  <div key={lv} className="flex items-center gap-2 flex-1">
                    <div className={cn(
                      "flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all",
                      done    ? "bg-brand-50 border-brand-200" :
                      current ? "bg-white border-brand-400 ring-2 ring-brand-200" :
                                "bg-gray-50 border-gray-200"
                    )}>
                      <span className="text-xs font-bold">{lv}</span>
                      <span className="text-xs text-gray-500 text-center leading-tight">{cfg.label.split("·")[1]?.trim()}</span>
                      {done && <span className="text-xs text-brand-600">✓</span>}
                      {current && <span className="text-xs text-brand-600 font-medium">Đang học</span>}
                    </div>
                    {i < 3 && <span className="text-gray-300 text-xs">→</span>}
                  </div>
                );
              })}
            </div>

            <div className="mb-1 flex justify-between text-sm">
              <span className="text-gray-600 font-medium">Hoàn thành {stats.level_progress.level}</span>
              <span className="text-brand-600 font-semibold">{stats.level_progress.percentage}%</span>
            </div>
            <Progress value={stats.level_progress.percentage} size="lg" barClassName="bg-brand-500" />

            {/* Weekly chart */}
            <div className="mt-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">XP tuần này</p>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={stats.weekly_progress} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 12 }}
                    formatter={(v: number) => [`${v} XP`, "Điểm"]}
                  />
                  <Bar dataKey="xp" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Skill radar ── */}
          <div className="card p-5">
            <h2 className="section-title mb-1">Kỹ năng</h2>
            <p className="section-subtitle mb-3">Điểm mạnh & điểm yếu</p>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#f0f0f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "#6b7280" }} />
                <Radar name="Score" dataKey="score" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {stats.skill_breakdown.map((s) => {
                const cfg = SKILL_CONFIG[s.skill];
                return (
                  <div key={s.skill} className="flex items-center gap-2">
                    <span className={cn("w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0", cfg.bg)}>{cfg.icon}</span>
                    <div className="flex-1">
                      <Progress value={s.score} size="sm" barClassName={
                        s.score >= 75 ? "bg-green-500" : s.score >= 50 ? "bg-amber-500" : "bg-red-400"
                      } />
                    </div>
                    <span className="text-xs font-semibold text-gray-600 w-8 text-right">{s.score}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Continue learning ── */}
          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Tiếp tục học</h2>
              <Link href="/dashboard/lessons" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                Xem tất cả →
              </Link>
            </div>
            <div className="space-y-3">
              {[...availableLessons, ...recentLessons.slice(0,1)].slice(0,4).map((lesson) => {
                const skillCfg = SKILL_CONFIG[lesson.skill];
                const statusColors = {
                  completed:    "bg-green-100 text-green-700",
                  in_progress:  "bg-blue-100 text-blue-700",
                  available:    "bg-gray-100 text-gray-600",
                  locked:       "bg-gray-100 text-gray-400",
                };
                const statusLabel = {
                  completed: "Hoàn thành", in_progress: "Đang học", available: "Bắt đầu", locked: "Khóa",
                };
                return (
                  <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group">
                      <div className={cn("skill-icon text-xl", skillCfg.bg)}>{skillCfg.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{lesson.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <LevelBadge level={lesson.level} />
                          <span className="text-xs text-gray-400">·</span>
                          <span className="text-xs text-gray-500">⏱ {lesson.duration_minutes} phút</span>
                          <span className="text-xs text-gray-400">·</span>
                          <span className="text-xs text-brand-600">+{lesson.xp_reward} XP</span>
                        </div>
                      </div>
                      <span className={cn("badge text-xs px-2.5 py-1", statusColors[lesson.status])}>
                        {statusLabel[lesson.status]}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Badges + Streak ── */}
          <div className="space-y-4">
            {/* Streak card */}
            <div className="card p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{getStreakEmoji(stats.current_streak)}</span>
                <div>
                  <p className="text-2xl font-bold text-orange-700">{stats.current_streak} ngày</p>
                  <p className="text-xs text-orange-600">Streak liên tiếp</p>
                </div>
              </div>
              <p className="text-xs text-orange-700 mb-2">Học mỗi ngày để duy trì streak!</p>
              <div className="flex gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className={cn(
                    "flex-1 h-1.5 rounded-full",
                    i < (stats.current_streak % 7) ? "bg-orange-500" : "bg-orange-200"
                  )} />
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-900 text-sm">Thành tích</h2>
                <span className="text-xs text-gray-500">{stats.badges.filter((b) => b.earned).length}/{stats.badges.length}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {stats.badges.map((badge) => (
                  <div
                    key={badge.id}
                    title={`${badge.name}: ${badge.description}`}
                    className={cn(
                      "aspect-square rounded-xl flex items-center justify-center text-xl border transition-all",
                      badge.earned
                        ? "bg-white border-gray-200 shadow-sm hover:scale-110"
                        : "bg-gray-50 border-gray-100 opacity-40 grayscale"
                    )}
                  >
                    {badge.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Daily goal */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-900 text-sm">Mục tiêu hôm nay</h2>
                <span className="text-xs text-brand-600 font-semibold">3/5 bài</span>
              </div>
              <Progress value={60} size="md" barClassName="bg-brand-500" />
              <p className="text-xs text-gray-500 mt-2">Còn 2 bài nữa để đạt mục tiêu hôm nay 🎯</p>
              <Link href="/dashboard/lessons" className="btn-primary w-full justify-center mt-3 text-sm py-2">
                Học ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

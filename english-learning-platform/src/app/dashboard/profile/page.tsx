"use client";
import { Header } from "@/components/layout/Header";
import { Progress } from "@/components/ui/Progress";
import { LevelBadge } from "@/components/ui/Badge";
import { useAppStore } from "@/lib/store";
import { MOCK_DASHBOARD } from "@/lib/mock-data";
import { xpToLevel, getStreakEmoji, SKILL_CONFIG, cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user } = useAppStore();
  const lvl = user ? xpToLevel(user.xp) : null;
  const stats = MOCK_DASHBOARD;

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Hồ sơ" />
      <div className="p-6 max-w-3xl mx-auto w-full space-y-5">

        {/* Profile card */}
        <div className="card p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {user.name.split(" ").pop()?.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <LevelBadge level={user.current_level} />
                <span className="badge bg-gray-100 text-gray-600">Lv.{lvl?.level}</span>
                {user.is_premium && <span className="badge bg-amber-100 text-amber-700">✨ Premium</span>}
              </div>
            </div>
            <button className="btn-secondary text-sm py-2 hidden sm:flex">Chỉnh sửa</button>
          </div>
        </div>

        {/* XP & Streak */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Tổng XP", value: user.xp.toLocaleString(), icon: "⚡", color: "text-brand-600" },
            { label: "Streak", value: `${user.streak} ngày`, icon: getStreakEmoji(user.streak), color: "text-orange-600" },
            { label: "Bài đã học", value: stats.lessons_completed, icon: "✅", color: "text-green-600" },
            { label: "Từ đã học", value: stats.words_learned, icon: "📚", color: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="card p-4 text-center">
              <p className="text-xl mb-1">{s.icon}</p>
              <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Level progress */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Tiến độ cấp độ</h3>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Lv.{lvl?.level} → Lv.{(lvl?.level ?? 0) + 1}</span>
            <span className="text-brand-600 font-semibold">{lvl?.progress}%</span>
          </div>
          <Progress value={lvl?.progress ?? 0} size="lg" />
          <p className="text-xs text-gray-400 mt-2">Còn {lvl?.next.toLocaleString()} XP để lên Lv.{(lvl?.level ?? 0) + 1}</p>
        </div>

        {/* Skill scores */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Điểm kỹ năng</h3>
          <div className="space-y-3">
            {stats.skill_breakdown.map((s) => {
              const cfg = SKILL_CONFIG[s.skill];
              return (
                <div key={s.skill} className="flex items-center gap-3">
                  <span className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", cfg.bg)}>{cfg.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{cfg.label}</span>
                      <span className={cn("font-semibold", s.score >= 75 ? "text-green-600" : s.score >= 50 ? "text-amber-600" : "text-red-500")}>
                        {s.score}%
                      </span>
                    </div>
                    <Progress value={s.score} size="sm" barClassName={s.score >= 75 ? "bg-green-500" : s.score >= 50 ? "bg-amber-500" : "bg-red-400"} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Thành tích ({stats.badges.filter((b) => b.earned).length}/{stats.badges.length})</h3>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {stats.badges.map((badge) => (
              <div key={badge.id} title={`${badge.name}: ${badge.description}`}
                className={cn("aspect-square rounded-xl flex flex-col items-center justify-center text-2xl border transition-all p-2",
                  badge.earned ? "bg-white border-gray-200 shadow-sm hover:scale-110 cursor-pointer" : "bg-gray-50 border-gray-100 opacity-35 grayscale"
                )}>
                <span>{badge.icon}</span>
                <span className="text-xs text-gray-500 mt-0.5 text-center leading-none truncate w-full text-center">{badge.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

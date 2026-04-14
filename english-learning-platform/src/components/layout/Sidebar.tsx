"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, LEVEL_CONFIG, SKILL_CONFIG, xpToLevel, getStreakEmoji } from "@/lib/utils";
import { Progress } from "@/components/ui/Progress";
import { useAppStore } from "@/lib/store";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "🏠", label: "Tổng quan" },
  { href: "/dashboard/lessons", icon: "📚", label: "Bài học" },
  { href: "/dashboard/vocabulary", icon: "💬", label: "Từ vựng" },
  { href: "/dashboard/grammar", icon: "📐", label: "Ngữ pháp" },
  { href: "/dashboard/practice", icon: "🎯", label: "Luyện tập" },
  { href: "/dashboard/mock-test", icon: "📝", label: "Thi thử" },
];

const SKILL_ITEMS = [
  { href: "/dashboard/listening", skill: "listening" as const },
  { href: "/dashboard/speaking",  skill: "speaking"  as const },
  { href: "/dashboard/reading",   skill: "reading"   as const },
  { href: "/dashboard/writing",   skill: "writing"   as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAppStore();
  const lvl = user ? xpToLevel(user.xp) : null;

  return (
    <aside className="w-[260px] flex-shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">EP</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">EnglishPath</span>
        </Link>
      </div>

      {/* User card */}
      {user && (
        <div className="px-4 py-3 mx-3 mt-3 bg-gradient-to-br from-brand-50 to-accent-50 rounded-xl border border-brand-100">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user.name.split(" ").pop()?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500">{LEVEL_CONFIG[user.current_level].label}</span>
                {user.is_premium && <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">PRO</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Lv.{lvl?.level} · {user.xp.toLocaleString()} XP</span>
            <span>còn {lvl?.next.toLocaleString()} XP</span>
          </div>
          <Progress value={lvl?.progress ?? 0} size="sm" />
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="flex items-center gap-1 text-orange-600 font-medium">
              {getStreakEmoji(user.streak)} {user.streak} ngày
            </span>
            {user.streak_shield > 0 && (
              <span className="flex items-center gap-1 text-blue-600">🛡️ x{user.streak_shield}</span>
            )}
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-3 px-3 scrollbar-hide">
        {/* Main nav */}
        <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Chính</p>
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href}
            className={cn("nav-item", pathname === item.href && "active")}>
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {/* Skills nav */}
        <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-1">Kỹ năng</p>
        {SKILL_ITEMS.map(({ href, skill }) => {
          const cfg = SKILL_CONFIG[skill];
          return (
            <Link key={href} href={href}
              className={cn("nav-item", pathname.startsWith(href) && "active")}>
              <span className={cn("w-6 h-6 rounded-md flex items-center justify-center text-sm", cfg.bg)}>{cfg.icon}</span>
              {cfg.label}
            </Link>
          );
        })}

        {/* Settings */}
        <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-1">Tài khoản</p>
        <Link href="/dashboard/profile" className={cn("nav-item", pathname === "/dashboard/profile" && "active")}>
          <span className="text-base">👤</span> Hồ sơ
        </Link>
        <Link href="/dashboard/settings" className={cn("nav-item", pathname === "/dashboard/settings" && "active")}>
          <span className="text-base">⚙️</span> Cài đặt
        </Link>
      </nav>

      {/* Premium upsell */}
      {user && !user.is_premium && (
        <div className="p-3 m-3 mt-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <p className="text-sm font-semibold text-amber-800 mb-0.5">✨ Nâng cấp Premium</p>
          <p className="text-xs text-amber-700 mb-2">Mở khóa B1, B2 và AI không giới hạn</p>
          <Link href="/pricing" className="block text-center text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg py-1.5 transition-colors">
            Xem gói Premium →
          </Link>
        </div>
      )}
    </aside>
  );
}

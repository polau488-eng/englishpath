"use client";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { getStreakEmoji } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const { user } = useAppStore();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 gap-4 sticky top-0 z-20">
      <div className="flex-1 min-w-0">
        {title && <h1 className="text-base font-semibold text-gray-900 truncate">{title}</h1>}
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        {/* Quick stats */}
        {user && (
          <div className="hidden sm:flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-orange-600 font-medium">
              <span>{getStreakEmoji(user.streak)}</span>
              <span>{user.streak}</span>
            </div>
            <div className="flex items-center gap-1.5 text-brand-600 font-medium">
              <span>⚡</span>
              <span>{user.xp.toLocaleString()} XP</span>
            </div>
          </div>
        )}
        {/* Notification */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Thông báo">
          <span className="text-lg">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        {/* Avatar */}
        {user && (
          <Link href="/dashboard/profile">
            <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:ring-2 hover:ring-brand-300 transition-all">
              {user.name.split(" ").pop()?.charAt(0)}
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}

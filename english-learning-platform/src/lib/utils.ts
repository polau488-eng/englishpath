import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Level, Skill } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LEVEL_CONFIG: Record<Level, { label: string; color: string; bg: string; border: string; next?: Level }> = {
  A1: { label: "A1 · Sơ cấp",   color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200", next: "A2" },
  A2: { label: "A2 · Cơ bản",   color: "text-teal-700",   bg: "bg-teal-50",   border: "border-teal-200",  next: "B1" },
  B1: { label: "B1 · Trung cấp", color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200", next: "B2" },
  B2: { label: "B2 · Khá",       color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
};

export const SKILL_CONFIG: Record<Skill, { label: string; icon: string; color: string; bg: string }> = {
  listening: { label: "Nghe",    icon: "🎧", color: "text-blue-700",   bg: "bg-blue-50"   },
  speaking:  { label: "Nói",     icon: "🎤", color: "text-red-700",    bg: "bg-red-50"    },
  reading:   { label: "Đọc",     icon: "📖", color: "text-emerald-700",bg: "bg-emerald-50"},
  writing:   { label: "Viết",    icon: "✍️", color: "text-purple-700", bg: "bg-purple-50" },
  grammar:   { label: "Ngữ pháp",icon: "📐", color: "text-amber-700",  bg: "bg-amber-50"  },
};

export function xpToLevel(xp: number): { level: number; progress: number; next: number } {
  const thresholds = [0, 500, 1500, 3000, 5500, 9000, 14000, 21000, 30000, 42000];
  let lvl = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) lvl = i + 1;
  }
  const cur = thresholds[Math.min(lvl - 1, thresholds.length - 1)] || 0;
  const nxt = thresholds[Math.min(lvl, thresholds.length - 1)] || thresholds[thresholds.length - 1];
  return { level: lvl, progress: Math.round(((xp - cur) / (nxt - cur)) * 100), next: nxt - xp };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}p` : `${h}h`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(date));
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 100) return "🏆";
  if (streak >= 30) return "💎";
  if (streak >= 14) return "🌟";
  if (streak >= 7)  return "🔥";
  return "⚡";
}

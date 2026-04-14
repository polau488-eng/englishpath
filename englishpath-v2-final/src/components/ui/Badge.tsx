import { cn } from "@/lib/utils";
import type { Level, Skill } from "@/types";
import { LEVEL_CONFIG, SKILL_CONFIG } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "premium";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default:  "bg-gray-100 text-gray-700",
    success:  "bg-green-100 text-green-700",
    warning:  "bg-amber-100 text-amber-700",
    danger:   "bg-red-100 text-red-700",
    info:     "bg-blue-100 text-blue-700",
    premium:  "bg-gradient-to-r from-amber-400 to-orange-400 text-white",
  };
  return <span className={cn("badge", variants[variant], className)}>{children}</span>;
}

export function LevelBadge({ level }: { level: Level }) {
  const cfg = LEVEL_CONFIG[level];
  return <span className={cn("badge", cfg.bg, cfg.color, cfg.border, "border")}>{level}</span>;
}

export function SkillBadge({ skill }: { skill: Skill }) {
  const cfg = SKILL_CONFIG[skill];
  return (
    <span className={cn("badge gap-1", cfg.bg, cfg.color)}>
      <span>{cfg.icon}</span>{cfg.label}
    </span>
  );
}

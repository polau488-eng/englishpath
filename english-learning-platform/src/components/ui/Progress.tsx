"use client";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Progress({ value, max = 100, className, barClassName, showLabel, size = "md" }: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };
  return (
    <div className="flex items-center gap-2">
      <div className={cn("progress-bar flex-1", heights[size], className)}>
        <div
          className={cn("progress-fill bg-brand-500", heights[size], barClassName)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-medium text-gray-500 min-w-[36px] text-right">{Math.round(pct)}%</span>}
    </div>
  );
}

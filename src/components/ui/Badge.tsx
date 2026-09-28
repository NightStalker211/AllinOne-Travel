import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type Tone = "neutral" | "accent" | "live" | "warn";

const tones: Record<Tone, string> = {
  neutral: "bg-muted text-fg-muted border-transparent",
  accent: "bg-accent/15 text-accent border-accent/30",
  live: "bg-live/15 text-live border-live/30",
  warn: "bg-warn/15 text-warn border-warn/30",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  children: ReactNode;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

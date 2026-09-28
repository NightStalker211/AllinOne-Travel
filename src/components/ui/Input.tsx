import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border bg-raised px-3.5 text-sm text-fg placeholder:text-fg-subtle transition-colors hover:border-line focus:border-accent focus:outline-none disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

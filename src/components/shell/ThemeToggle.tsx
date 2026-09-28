"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  // Read after mount: the pre-paint script owns the first render.
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    document.documentElement.classList.toggle("dark", !next);
    try {
      localStorage.setItem("ait-theme", next ? "light" : "dark");
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={
        className ??
        "inline-flex h-9 w-9 items-center justify-center rounded-xl border text-fg-muted transition-colors hover:bg-muted hover:text-fg"
      }
    >
      {isLight ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

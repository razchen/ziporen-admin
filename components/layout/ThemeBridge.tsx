// src/components/common/ThemeBridge.tsx
"use client";

import * as React from "react";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";

const STORAGE_KEY = "ui.theme"; // optional persistence

export default function ThemeBridge() {
  const mode = useAppSelector((s: RootState) => s.theme.mode);

  // hydrate from localStorage on first mount (optional)
  React.useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as
      | "light"
      | "dark"
      | "system"
      | null;
    if (saved) {
      // we don't dispatch here to avoid double renders; you can if you want
      if (saved !== mode) {
        const ev = new CustomEvent("redux/theme/hydrate", { detail: saved });
        window.dispatchEvent(ev);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // listen for hydration event and set html class accordingly too
  React.useEffect(() => {
    const handler = (e: Event) => {
      const desired = (e as CustomEvent).detail as "light" | "dark" | "system";
      applyTheme(desired);
    };
    window.addEventListener("redux/theme/hydrate", handler as EventListener);
    return () =>
      window.removeEventListener(
        "redux/theme/hydrate",
        handler as EventListener
      );
  }, []);

  // apply on Redux change
  React.useEffect(() => {
    applyTheme(mode);
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {}
  }, [mode]);

  return null;
}

function applyTheme(mode: "light" | "dark" | "system") {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = mode === "system" ? prefersDark : mode === "dark";

  root.classList.toggle("dark", isDark);
}

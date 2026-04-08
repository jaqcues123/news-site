"use client";

import { useTheme } from "@/lib/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      role="switch"
      aria-checked={isDark}
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center
        rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFC700] focus-visible:ring-offset-2
        ${isDark ? "bg-[#FFC700]" : "bg-[#555555]"}
      `}
    >
      {/* Thumb — inline-block so it flows inside the button naturally */}
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-5 w-5 rounded-full bg-white
          shadow-md ring-0 transition-transform duration-200 ease-in-out
          ${isDark ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}

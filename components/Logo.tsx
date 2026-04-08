"use client";

import Image from "next/image";
import { useTheme } from "@/lib/ThemeProvider";

interface LogoProps {
  /** Height in px — width scales automatically */
  height?: number;
  className?: string;
}

export default function Logo({ height = 48, className = "" }: LogoProps) {
  const { theme } = useTheme();

  return (
    <div className={`relative flex items-center ${className}`} style={{ height }}>
      {/* Dark mode logo — dark/charcoal background badge */}
      <Image
        src="/images/newsfleetblack.png"
        alt="New England Wrecker Sales"
        height={height}
        width={height * 1.15}
        className={`h-full w-auto object-contain transition-opacity duration-200 ${
          theme === "dark" ? "opacity-100" : "opacity-0 absolute"
        }`}
        priority
      />
      {/* Light mode logo — white background badge */}
      <Image
        src="/images/newsfleetwhite.png"
        alt="New England Wrecker Sales"
        height={height}
        width={height * 1.15}
        className={`h-full w-auto object-contain transition-opacity duration-200 ${
          theme === "light" ? "opacity-100" : "opacity-0 absolute"
        }`}
        priority
      />
    </div>
  );
}

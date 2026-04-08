"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/ThemeProvider";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isDark
          ? "bg-[#111111]"
          : scrolled
            ? "bg-white shadow-md border-b border-[#E0E0E0]"
            : "bg-white border-b border-[#E0E0E0]"
        }
      `}
    >
      <div className="container-site">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="New England Wrecker Sales — Home">
            <Logo height={44} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors duration-150 ${
                  pathname === link.href
                    ? "text-[#FFC700]"
                    : isDark
                      ? "text-gray-300 hover:text-white"
                      : "text-[#2B2B2B] hover:text-[#111111]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <ThemeToggle />

            <Link href="/inventory" className="btn-primary text-sm py-2 px-5">
              View Inventory
            </Link>
          </nav>

          {/* Mobile right: toggle + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-0.5 transition-all duration-200 ${
                  isDark ? "bg-white" : "bg-[#111111]"
                } ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 transition-all duration-200 ${
                  isDark ? "bg-white" : "bg-[#111111]"
                } ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-5 h-0.5 transition-all duration-200 ${
                  isDark ? "bg-white" : "bg-[#111111]"
                } ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`
          md:hidden transition-all duration-200 overflow-hidden
          ${isDark
            ? "border-t border-white/10"
            : "border-t border-[#E0E0E0]"
          }
          ${menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <nav
          className={`container-site py-4 flex flex-col gap-1 ${
            isDark ? "bg-[#111111]" : "bg-white"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                pathname === link.href
                  ? isDark
                    ? "text-[#FFC700] bg-white/5"
                    : "text-[#FFC700] bg-[#FFC700]/10"
                  : isDark
                    ? "text-gray-300 hover:text-white hover:bg-white/5"
                    : "text-[#2B2B2B] hover:text-[#111111] hover:bg-[#F5F5F5]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/inventory" className="mt-2 btn-primary text-sm justify-center">
            View Inventory
          </Link>
        </nav>
      </div>
    </header>
  );
}

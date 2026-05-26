"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navItems = [
  { href: "/", icon: "bi-house-fill", label: "Inicio" },
  { href: "/match", icon: "bi-search", label: "Buscar" },
  { href: "/my-recipes", icon: "bi-plus-circle-fill", label: "Crear" },
  { href: "/favorites", icon: "bi-heart-fill", label: "Favoritos" },
  { href: "/profile", icon: "bi-person-fill", label: "Perfil" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-18 h-screen bg-[#FFFFFF] dark:bg-[#0f0f23] border-r-2 border-[#EDD9C8] dark:border-[#3a3a5c] flex flex-col items-center py-5 gap-2 flex-shrink-0">
      {/* Logo */}
      <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] rounded-full flex items-center justify-center mb-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 3L12 14L20 3H4Z" fill="white" stroke="none" />
          <line x1="12" y1="14" x2="12" y2="20" />
          <line x1="8" y1="20" x2="16" y2="20" />
        </svg>
      </div>
      {/* Botones */}
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              w-13 h-13 rounded-xl
              flex flex-col items-center justify-center gap-1
              transition-all duration-300 ease-in-out
              active:scale-90
              hover:-translate-y-0.5 hover:shadow-md
              ${
                isActive
                  ? "bg-gradient-to-br from-[#FF6B6B]/15 via-[#4ECDC4]/15 to-[#FFD93D]/15 scale-105"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }
            `}
          >
            <i
              className={`
                bi ${item.icon} text-lg
                transition-all duration-300
                ${
                  isActive
                    ? "text-[#4ECDC4] scale-110"
                    : "text-[#9B7A6A] dark:text-[#6b5a52] hover:scale-110 hover:text-[#4ECDC4]"
                }
              `}
            >
              {""}
            </i>
            <span
              className={`
                text-[9px] tracking-wide
                transition-all duration-300
                ${isActive ? "text-[#4ECDC4] font-medium" : "text-[#9B7A6A] dark:text-[#6b5a52]"}
              `}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
      <div className="flex-1" />
      <ThemeToggle />
    </nav>
  );
}

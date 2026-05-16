"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;

    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  function toggleTheme() {
    const newDark = !isDark;

    setIsDark(newDark);

    localStorage.setItem("theme", newDark ? "dark" : "light");
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        w-13 h-13 rounded-xl
        flex flex-col items-center justify-center gap-1
        transition-all duration-300 ease-in-out
        active:scale-90
        hover:-translate-y-0.5
        hover:shadow-md
        hover:bg-black/5
        dark:hover:bg-white/5
        cursor-pointer
      "
    >
      <i
        className={`
          bi ${isDark ? "bi-sun" : "bi-moon"}
          text-lg
          text-[#9B7A6A]
          dark:text-[#6b5a52]
          transition-all duration-300
          hover:scale-110
          hover:text-[#4ECDC4]
        `}
      />

      <span
        className="
          text-[9px]
          tracking-wide
          text-[#9B7A6A]
          dark:text-[#6b5a52]
          transition-all duration-300
        "
      >
        {isDark ? "Claro" : "Oscuro"}
      </span>
    </button>
  );
}

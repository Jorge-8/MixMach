"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setTimeout(() => setIsDark(true), 0);
    }
  }, []);

  function toggleTheme() {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-all duration-200"
    >
      <i
        className={`bi ${isDark ? "bi-sun" : "bi-moon"} text-lg text-[#9B7A6A]`}
      >
        {""}
      </i>
      <span className="text-[9px] text-[#9B7A6A]">
        {isDark ? "Claro" : "Oscuro"}
      </span>
    </button>
  );
}

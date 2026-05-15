"use client";
import { useRouter } from "next/navigation";

export default function ProfileCard() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center gap-4 bg-[#FFFFFF] dark:bg-[#1a1a2e] border-2 border-[#EDD9C8] dark:border-[#3a3a5c] rounded-2xl p-8 shadow-xl shadow-[#EDD9C8]/50 mx-auto max-w-sm w-full">
      <section className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
        <h1 className="text-3xl font-bold text-[#2C1810] dark:text-[#FFF8F0]">
          Sesion iniciada
        </h1>
      </section>

      <button
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          router.push("/login");
        }}
        className="w-full border-2 border-[#EDD9C8] dark:border-[#3a3a5c] text-[#9B7A6A] dark:text-[#a89088] py-2 rounded-lg font-medium hover:border-[#FF6B6B] hover:text-[#FF6B6B] active:scale-95 transition-all duration-200 cursor-pointer"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

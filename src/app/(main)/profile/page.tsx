"use client";
import { useEffect, useState } from "react";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import ProfileCard from "@/components/auth/ProfileCard";

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(logged === "true");
  }, []);

  if (isLoggedIn === null) return null;

  // Sin sesión: centrar el formulario de login
  if (!isLoggedIn) {
    return (
      <section className="flex items-center justify-center h-full">
        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
    );
  }

  // Con sesión: ProfileCard ocupa todo el espacio disponible sin wrapper extra
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Suspense>
        <ProfileCard />
      </Suspense>
    </div>
  );
}

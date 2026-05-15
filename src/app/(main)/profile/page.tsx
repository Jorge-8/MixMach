"use client";
import { useEffect, useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import ProfileCard from "@/components/auth/ProfileCard";
import { Suspense } from "react";

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn");
    setTimeout(() => setIsLoggedIn(logged === "true"), 0);
  }, []);

  if (!isLoggedIn) {
    return (
      <section className="flex items-center justify-center h-full">
        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
    );
  }

  return (
    <section className="flex items-center justify-center h-full">
      <ProfileCard />
    </section>
  );
}

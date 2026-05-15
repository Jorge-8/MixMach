// app/(auth)/login/page.tsx
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="h-full flex items-center justify-center">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

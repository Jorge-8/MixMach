"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// API
import { authService } from "@/services/authService";

export default function LoginForm() {
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  //////
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "true") {
      setTimeout(() => setShowWelcomeModal(true), 0);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const newErrors = { email: "", password: "" };
    let valid = true;

    if (!form.email.includes("@") || !form.email.includes(".com")) {
      newErrors.email = "Ingresa un correo válido (debe tener @ y .com)";
      valid = false;
    }
    if (!form.password) {
      newErrors.password = "La contraseña es obligatoria";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handleSubmit() {
    if (validate()) {
      setIsLoading(true);
      setApiError("");

      try {
        await authService.login({
          email: form.email,
          password: form.password,
        });
        setShowSuccessModal(true);
      } catch (error: any) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      {/* ── Formulario ── */}
      <div className="flex flex-col dark:bg-[#1a1a2e] dark:border-[#3a3a5c] items-center gap-3 bg-[#FFFFFF] border-2 border-[#EDD9C8] rounded-2xl p-8 shadow-xl shadow-[#EDD9C8]/50 mx-auto max-w-sm w-full">
        <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">MM</span>
        </div>

        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
            MixMatch
          </span>
        </h1>

        <h3 className="text-[#9B7A6A] dark:text-[#a89088]">
          Bienvenido de vuelta
        </h3>

        {/* Correo */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm text-[#2C1810] dark:text-[#a89088] font-medium">
            Correo electrónico
          </label>
          <input
            name="email"
            type="email"
            placeholder="tu@correo.com"
            value={form.email}
            onChange={handleChange}
            className={`w-full dark:border-[#3a3a5c] dark:bg-[#16213e] dark:text-white border text-[#9B7A6A] bg-[#FFF3EA] rounded-lg px-3 py-2 outline-none transition-colors
              ${errors.email ? "border-red-400" : "border-[#EDD9C8] focus:border-[#4ECDC4]"}`}
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Contraseña */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm text-[#2C1810] dark:text-[#a89088] font-medium">
            Contraseña
          </label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className={`w-full dark:border-[#3a3a5c] dark:bg-[#16213e] dark:text-white text-[#9B7A6A] bg-[#FFF3EA] border rounded-lg px-3 py-2 pr-10 outline-none transition-colors
                ${errors.password ? "border-red-400" : "border-[#EDD9C8] focus:border-[#4ECDC4]"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B7A6A] hover:text-[#4ECDC4] transition-colors"
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"} text-base`}
              >
                {""}
              </i>
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password}</p>
          )}
        </div>

        {/* API */}
        {apiError && (
          <p className="text-xs text-red-400 text-center">{apiError}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white py-2 rounded-lg font-medium hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Entrar
        </button>

        <p className="text-sm text-center text-gray-500 dark:text-[#a89088]">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-[#4ECDC4] font-medium">
            Registrarse
          </Link>
        </p>
      </div>

      {/* ── Modal: viene del registro ── */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a2e] border-2 border-[#EDD9C8] dark:border-[#3a3a5c] rounded-2xl p-8 shadow-2xl w-full max-w-sm flex flex-col items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] rounded-full flex items-center justify-center">
              <i className="bi bi-patch-check text-white text-3xl">{""}</i>
            </div>
            <div className="text-center flex flex-col gap-2">
              <h2 className="text-xl font-bold text-[#2C1810] dark:text-[#FFF8F0]">
                ¡Cuenta creada!
              </h2>
              <p className="text-sm text-[#9B7A6A] dark:text-[#a89088]">
                Tu cuenta ha sido verificada exitosamente. Ya puedes iniciar
                sesión con tus credenciales.
              </p>
            </div>
            <button
              onClick={() => setShowWelcomeModal(false)}
              className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white py-2 rounded-lg font-medium hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      )}

      {/* ── Modal: login exitoso ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a2e] border-2 border-[#EDD9C8] dark:border-[#3a3a5c] rounded-2xl p-8 shadow-2xl w-full max-w-sm flex flex-col items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] rounded-full flex items-center justify-center">
              <i className="bi bi-person-check text-white text-3xl">{""}</i>
            </div>
            <div className="text-center flex flex-col gap-2">
              <h2 className="text-xl font-bold text-[#2C1810] dark:text-[#FFF8F0]">
                ¡Bienvenido!
              </h2>
              <p className="text-sm text-[#9B7A6A] dark:text-[#a89088]">
                Sesión iniciada correctamente. Ahora puedes guardar tus cócteles
                favoritos y crear recetas.
              </p>
            </div>
            <button
              onClick={() => router.push("/profile")}
              className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white py-2 rounded-lg font-medium hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Ir a mi perfil
            </button>
          </div>
        </div>
      )}
    </>
  );
}

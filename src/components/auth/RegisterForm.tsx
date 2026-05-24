"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

// API
import { authService } from "@/services/authService";

export default function RegisterForm() {

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  //
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function getPasswordStrength(password: string) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  }

  const strength = getPasswordStrength(form.password);
  const strengthLabel = ["", "Débil", "Regular", "Buena", "Fuerte"][strength];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-400",
  ][strength];

  function validate() {
    const newErrors = { name: "", email: "", password: "", confirm: "" };
    let valid = true;
    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
      valid = false;
    }
    if (!form.email.includes("@") || !form.email.includes(".com")) {
      newErrors.email = "Ingresa un correo válido (debe tener @ y .com)";
      valid = false;
    }
    if (strength < 3) {
      newErrors.password =
        "Debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo";
      valid = false;
    }
    if (form.confirm !== form.password) {
      newErrors.confirm = "Las contraseñas no coinciden";
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
        await authService.register({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setCode(["", "", "", "", "", ""]);
        setShowModal(true);
      } catch (error: any) {
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  }

  function handleCodeChange(value: string, index: number) {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (e.key === "Backspace" && !code[index] && index > 0)
      inputsRef.current[index - 1]?.focus();
  }

  const codeComplete = code.every((d) => d !== "");

  function handleVerify() {
    if (codeComplete) router.push("/login?registered=true");
  }

  return (
    <>
      {/* ── Formulario ── */}
      <div className="flex flex-col items-center gap-3 bg-[#FFFFFF] dark:bg-[#1a1a2e] border-2 border-[#EDD9C8] dark:border-[#3a3a5c] rounded-2xl p-8 shadow-2xl shadow-[#00000090]/50 mx-auto max-w-sm w-full">
        <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">MM</span>
        </div>

        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
            MixMatch
          </span>
        </h1>

        <h6 className="text-[#9B7A6A] dark:text-[#a89088]">Crea tu cuenta</h6>

        {/* Nombre */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm text-[#2C1810] dark:text-[#a89088] font-medium">
            Nombre completo
          </label>
          <input
            name="name"
            type="text"
            placeholder="Tu nombre"
            value={form.name}
            onChange={handleChange}
            className={`w-full bg-[#FFF3EA] dark:bg-[#16213e] text-[#2C1810] dark:text-white text-sm border rounded-lg px-3 py-2 outline-none transition-colors
              ${errors.name ? "border-red-400" : "border-[#EDD9C8] dark:border-[#3a3a5c] focus:border-[#4ECDC4]"}`}
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
        </div>

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
            className={`w-full bg-[#FFF3EA] dark:bg-[#16213e] text-[#2C1810] dark:text-white text-sm border rounded-lg px-3 py-2 outline-none transition-colors
              ${errors.email ? "border-red-400" : "border-[#EDD9C8] dark:border-[#3a3a5c] focus:border-[#4ECDC4]"}`}
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
              placeholder="••••••••••"
              value={form.password}
              onChange={handleChange}
              className={`w-full bg-[#FFF3EA] dark:bg-[#16213e] text-[#2C1810] dark:text-white text-sm border rounded-lg px-3 py-2 pr-10 outline-none transition-colors
                ${errors.password ? "border-red-400" : "border-[#EDD9C8] dark:border-[#3a3a5c] focus:border-[#4ECDC4]"}`}
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
          {form.password.length > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-gray-200 dark:bg-[#3a3a5c]"}`}
                  />
                ))}
              </div>
              <p
                className={`text-xs ${["", "text-red-400", "text-orange-400", "text-yellow-500", "text-green-500"][strength]}`}
              >
                {strengthLabel}
              </p>
            </div>
          )}
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div className="flex flex-col gap-1 w-full">
          <label className="text-sm text-[#2C1810] dark:text-[#a89088] font-medium">
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              name="confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••••"
              value={form.confirm}
              onChange={handleChange}
              className={`w-full bg-[#FFF3EA] dark:bg-[#16213e] text-[#2C1810] dark:text-white text-sm border rounded-lg px-3 py-2 pr-10 outline-none transition-colors
                ${errors.confirm ? "border-red-400" : form.confirm && form.confirm === form.password ? "border-green-400" : "border-[#EDD9C8] dark:border-[#3a3a5c] focus:border-[#4ECDC4]"}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B7A6A] hover:text-[#4ECDC4] transition-colors"
            >
              <i
                className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"} text-base`}
              >
                {""}
              </i>
            </button>
          </div>
          {errors.confirm && (
            <p className="text-xs text-red-400">{errors.confirm}</p>
          )}
          {form.confirm && form.confirm === form.password && (
            <p className="text-xs text-green-500">
              Las contraseñas coinciden ✓
            </p>
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
          Registrarse
        </button>

        <p className="text-sm text-center text-gray-500 dark:text-[#a89088]">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-[#4ECDC4] font-medium">
            Iniciar sesión
          </Link>
        </p>
      </div>

      {/* ── Modal de verificación ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a2e] border-2 border-[#EDD9C8] dark:border-[#3a3a5c] rounded-2xl p-8 shadow-2xl w-full max-w-sm flex flex-col items-center gap-5 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] rounded-full flex items-center justify-center">
              <i className="bi bi-envelope-check text-white text-2xl">{""}</i>
            </div>
            <div className="text-center flex flex-col gap-1">
              <h2 className="text-xl font-bold text-[#2C1810] dark:text-[#FFF8F0]">
                Verifica tu correo
              </h2>
              <p className="text-sm text-[#9B7A6A] dark:text-[#a89088]">
                Se enviará un código de verificación a:
              </p>
              <p className="text-sm font-semibold text-[#4ECDC4]">
                {form.email}
              </p>
              <p className="text-sm text-[#9B7A6A] dark:text-[#a89088] mt-1">
                Ingresa el código de 6 dígitos para continuar.
              </p>
            </div>
            <div className="flex gap-2">
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  className={`w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all duration-200
                    ${digit ? "border-[#4ECDC4] bg-[#4ECDC4]/10 text-[#2C1810] dark:text-white" : "border-[#EDD9C8] dark:border-[#3a3a5c] bg-[#FFF3EA] dark:bg-[#16213e] text-[#2C1810] dark:text-white"}
                    focus:border-[#4ECDC4] focus:bg-[#4ECDC4]/5`}
                />
              ))}
            </div>
            <button
              onClick={handleVerify}
              disabled={!codeComplete}
              className={`w-full py-2 rounded-lg font-medium transition-all duration-300
                ${
                  codeComplete
                    ? "bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white hover:opacity-90 active:scale-95 cursor-pointer"
                    : "bg-gray-200 dark:bg-[#3a3a5c] text-gray-400 dark:text-[#6b5a52] cursor-not-allowed"
                }`}
            >
              Validar código
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="text-sm text-[#9B7A6A] dark:text-[#a89088] hover:text-[#FF6B6B] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

"use client";
import { useState, useRef } from "react";
import { IMyRecipeForm, EMPTY_RECIPE_FORM } from "@/types/IMyRecipe";

interface Props {
  onClose: () => void;
  // TODO BACKEND: onSave llamará a POST /api/my-recipes/ con el body del formulario
  // y recibirá el IMyRecipe creado (con id y createdAt del servidor)
  onSave: (form: IMyRecipeForm) => Promise<void>;
}

// ─────────────────────────────────────────────────────────────
// Unidades predefinidas — MANTENER: 100% frontend, no cambia con el back
// ─────────────────────────────────────────────────────────────
const UNITS = [
  "ml",
  "cl",
  "oz",
  "l",
  "pz",
  "cdas",
  "cdita",
  "tazas",
  "g",
  "kg",
  "hojas",
  "rodajas",
  "unidad",
  "al gusto",
  "pizca",
];

// Tipo interno para manejar cantidad + unidad por separado
interface IngredientRow {
  name: string;
  qty: string; // valor numérico
  unit: string; // unidad del selector
}

// Combina qty + unit → string para ICocktailIngredient.amount
function rowToAmount(row: IngredientRow): string {
  if (row.unit === "al gusto" || row.unit === "pizca") return row.unit;
  return [row.qty, row.unit].filter(Boolean).join(" ").trim();
}

const EMPTY_ROW: IngredientRow = { name: "", qty: "", unit: "ml" };

// ─────────────────────────────────────────────────────────────
// Validación básica del formulario (100% frontend, no cambia con back)
// ─────────────────────────────────────────────────────────────
function validate(
  name: string,
  rows: IngredientRow[],
  steps: string[]
): string | null {
  if (!name.trim()) return "El nombre del cóctel es requerido.";
  if (rows.some((r) => !r.name.trim()))
    return "Todos los ingredientes deben tener nombre.";
  if (steps.some((s) => !s.trim()))
    return "Todos los pasos de preparación deben tener contenido.";
  return null;
}

export default function RecipeFormModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState<IMyRecipeForm>(EMPTY_RECIPE_FORM);
  // Estado separado para filas de ingredientes con qty + unit
  const [ingredientRows, setIngredientRows] = useState<IngredientRow[]>([
    { ...EMPTY_ROW },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Imagen ──
  // TODO BACKEND: al conectar el back, enviar el File directamente con FormData
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  }

  // ── Ingredientes ──
  function addIngredient() {
    setIngredientRows((prev) => [...prev, { ...EMPTY_ROW }]);
  }

  function removeIngredient(index: number) {
    setIngredientRows((prev) => prev.filter((_, i) => i !== index));
  }

  function updateRow(index: number, field: keyof IngredientRow, value: string) {
    setIngredientRows((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  // ── Pasos ──
  function addStep() {
    setForm((prev) => ({ ...prev, steps: [...prev.steps, ""] }));
  }

  function removeStep(index: number) {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  }

  function updateStep(index: number, value: string) {
    setForm((prev) => {
      const updated = [...prev.steps];
      updated[index] = value;
      return { ...prev, steps: updated };
    });
  }

  // ── Guardar ──
  async function handleSave() {
    const err = validate(form.name, ingredientRows, form.steps);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setSaving(true);

    // Construir ingredientes finales combinando qty + unit → amount
    const builtIngredients = ingredientRows.map((row) => ({
      name: row.name,
      amount: rowToAmount(row),
    }));

    const finalForm: IMyRecipeForm = { ...form, ingredients: builtIngredients };

    try {
      await onSave(finalForm);
    } catch {
      setError("No se pudo guardar la receta. Inténtalo de nuevo.");
      setSaving(false);
    }
  }

  const isUnitless = (unit: string) => unit === "al gusto" || unit === "pizca";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1a2e] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDD9C8] dark:border-[#3a3a5c] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍊</span>
            <h2 className="text-lg font-bold text-[#2C1810] dark:text-[#FFF8F0]">
              Crear Receta Personalizada
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FFF3EA] dark:bg-[#16213e] text-[#9B7A6A] hover:text-[#FF6B6B] hover:scale-110 transition-all duration-150"
          >
            <i className="bi bi-x-lg text-sm">{""}</i>
          </button>
        </div>

        {/* Body scrolleable */}
        <div className="flex-1 overflow-y-auto custom-scroll px-6 py-5 flex flex-col gap-5">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl px-4 py-2.5">
              <i className="bi bi-exclamation-circle text-[#FF6B6B] text-sm">
                {""}
              </i>
              <p className="text-xs text-[#FF6B6B] font-medium">{error}</p>
            </div>
          )}

          {/* ── Sección: Información Básica ── */}
          <section className="flex flex-col gap-3 p-4 bg-[#FFF8F0] dark:bg-[#16213e] rounded-2xl border border-[#EDD9C8] dark:border-[#3a3a5c]">
            <p className="text-xs font-bold text-[#4ECDC4] uppercase tracking-widest">
              Información Básica
            </p>

            {/* Nombre */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#2C1810] dark:text-[#FFF8F0]">
                Nombre del cóctel
              </label>
              <input
                type="text"
                placeholder="Ej: Mi Mojito Especial"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="w-full bg-white dark:bg-[#0f0f23] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl px-4 py-2.5 text-sm text-[#2C1810] dark:text-[#FFF8F0] placeholder-[#9B7A6A] outline-none focus:border-[#4ECDC4] transition-colors"
              />
            </div>

            {/* Dificultad + Tipo */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#2C1810] dark:text-[#FFF8F0]">
                  Dificultad
                </label>
                <div className="flex gap-1 flex-wrap">
                  {(["Fácil", "Medio", "Difícil"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setForm((p) => ({ ...p, difficulty: d }))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer
                        ${
                          form.difficulty === d
                            ? "bg-[#4ECDC4] border-[#4ECDC4] text-white"
                            : "bg-white dark:bg-[#0f0f23] border-[#EDD9C8] dark:border-[#3a3a5c] text-[#9B7A6A] hover:border-[#4ECDC4]"
                        }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#2C1810] dark:text-[#FFF8F0]">
                  Tipo de bebida
                </label>
                <div className="flex gap-1">
                  {[
                    { label: "Alcohólico", val: true },
                    { label: "Sin alcohol", val: false },
                  ].map(({ label, val }) => (
                    <button
                      key={label}
                      onClick={() =>
                        setForm((p) => ({ ...p, isAlcoholic: val }))
                      }
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer
                        ${
                          form.isAlcoholic === val
                            ? "bg-[#FF6B6B] border-[#FF6B6B] text-white"
                            : "bg-white dark:bg-[#0f0f23] border-[#EDD9C8] dark:border-[#3a3a5c] text-[#9B7A6A] hover:border-[#FF6B6B]"
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#2C1810] dark:text-[#FFF8F0]">
                Imagen del cóctel
              </label>
              {/* TODO BACKEND: la imagen se enviará como File en FormData */}
              {form.image ? (
                <div className="relative h-36 rounded-xl overflow-hidden">
                  <img
                    src={form.image}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setForm((p) => ({ ...p, image: null }))}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-[#FF6B6B] transition-colors"
                  >
                    <i className="bi bi-x text-sm">{""}</i>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-28 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl text-[#9B7A6A] hover:border-[#4ECDC4] hover:text-[#4ECDC4] transition-colors cursor-pointer"
                >
                  <i className="bi bi-cloud-upload text-2xl">{""}</i>
                  <p className="text-xs text-center">
                    Arrastra una imagen aquí
                    <br />
                    <span className="text-[10px]">
                      o haz clic para seleccionar
                    </span>
                  </p>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Descripción */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#2C1810] dark:text-[#FFF8F0]">
                Descripción{" "}
                <span className="text-[#9B7A6A] font-normal">(opcional)</span>
              </label>
              <textarea
                placeholder="Describe brevemente tu cóctel..."
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={2}
                className="w-full bg-white dark:bg-[#0f0f23] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl px-4 py-2.5 text-sm text-[#2C1810] dark:text-[#FFF8F0] placeholder-[#9B7A6A] outline-none focus:border-[#4ECDC4] transition-colors resize-none"
              />
            </div>
          </section>

          {/* ── Sección: Ingredientes ── */}
          <section className="flex flex-col gap-3 p-4 bg-[#FFF8F0] dark:bg-[#16213e] rounded-2xl border border-[#EDD9C8] dark:border-[#3a3a5c]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#FF6B6B] uppercase tracking-widest">
                Ingredientes
              </p>
              <button
                onClick={addIngredient}
                className="flex items-center gap-1 text-xs font-medium text-[#4ECDC4] hover:text-[#4ECDC4]/80 transition-colors cursor-pointer"
              >
                <i className="bi bi-plus-circle text-sm">{""}</i>
                Agregar
              </button>
            </div>

            {/* Encabezados de columnas */}
            <div className="grid grid-cols-[1fr_56px_80px_28px] gap-2 px-1">
              <span className="text-[10px] font-semibold text-[#9B7A6A] uppercase tracking-wide">
                Ingrediente
              </span>
              <span className="text-[10px] font-semibold text-[#9B7A6A] uppercase tracking-wide">
                Cant.
              </span>
              <span className="text-[10px] font-semibold text-[#9B7A6A] uppercase tracking-wide">
                Unidad
              </span>
              <span />
            </div>

            <div className="flex flex-col gap-2">
              {ingredientRows.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_56px_80px_28px] gap-2 items-center"
                >
                  {/* Nombre del ingrediente */}
                  <input
                    type="text"
                    placeholder="Ron blanco..."
                    value={row.name}
                    onChange={(e) => updateRow(i, "name", e.target.value)}
                    className="bg-white dark:bg-[#0f0f23] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl px-3 py-2 text-xs text-[#2C1810] dark:text-[#FFF8F0] placeholder-[#9B7A6A] outline-none focus:border-[#4ECDC4] transition-colors"
                  />

                  {/* Cantidad — se deshabilita si la unidad no la necesita */}
                  {isUnitless(row.unit) ? (
                    <div className="h-[34px] bg-[#FFF3EA] dark:bg-[#0f0f23]/40 border border-dashed border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl flex items-center justify-center">
                      <span className="text-[10px] text-[#9B7A6A]">—</span>
                    </div>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="60"
                      value={row.qty}
                      onChange={(e) => updateRow(i, "qty", e.target.value)}
                      className="bg-white dark:bg-[#0f0f23] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl px-2 py-2 text-xs text-[#2C1810] dark:text-[#FFF8F0] placeholder-[#9B7A6A] outline-none focus:border-[#4ECDC4] transition-colors text-center"
                    />
                  )}

                  {/* Selector de unidad */}
                  <select
                    value={row.unit}
                    onChange={(e) => updateRow(i, "unit", e.target.value)}
                    className="bg-white dark:bg-[#0f0f23] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl px-2 py-2 text-xs text-[#2C1810] dark:text-[#FFF8F0] outline-none focus:border-[#4ECDC4] transition-colors cursor-pointer"
                  >
                    {UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>

                  {/* Eliminar fila */}
                  {ingredientRows.length > 1 ? (
                    <button
                      onClick={() => removeIngredient(i)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-all duration-150 cursor-pointer"
                    >
                      <i className="bi bi-trash3 text-xs">{""}</i>
                    </button>
                  ) : (
                    <div className="w-7" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Sección: Pasos de Preparación ── */}
          <section className="flex flex-col gap-3 p-4 bg-[#FFF8F0] dark:bg-[#16213e] rounded-2xl border border-[#EDD9C8] dark:border-[#3a3a5c]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-[#FFD93D] uppercase tracking-widest">
                Pasos de Preparación
              </p>
              <button
                onClick={addStep}
                className="flex items-center gap-1 text-xs font-medium text-[#4ECDC4] hover:text-[#4ECDC4]/80 transition-colors cursor-pointer"
              >
                <i className="bi bi-plus-circle text-sm">{""}</i>
                Agregar paso
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {form.steps.map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="w-6 h-6 rounded-full bg-[#FF6B6B] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-2">
                    {i + 1}
                  </span>
                  <textarea
                    placeholder={`Describe el paso ${i + 1}...`}
                    value={step}
                    onChange={(e) => updateStep(i, e.target.value)}
                    rows={2}
                    className="flex-1 bg-white dark:bg-[#0f0f23] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl px-3 py-2 text-xs text-[#2C1810] dark:text-[#FFF8F0] placeholder-[#9B7A6A] outline-none focus:border-[#4ECDC4] transition-colors resize-none"
                  />
                  {form.steps.length > 1 && (
                    <button
                      onClick={() => removeStep(i)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-[#FF6B6B]/10 text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-all duration-150 cursor-pointer flex-shrink-0 mt-1"
                    >
                      <i className="bi bi-trash3 text-xs">{""}</i>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── Tip opcional ── */}
          <section className="flex flex-col gap-2 p-4 bg-[#FFF8F0] dark:bg-[#16213e] rounded-2xl border border-[#EDD9C8] dark:border-[#3a3a5c]">
            <p className="text-xs font-bold text-[#9B7A6A] uppercase tracking-widest">
              Consejo Final{" "}
              <span className="font-normal normal-case">(opcional)</span>
            </p>
            <input
              type="text"
              placeholder="Ej: Sírvelo bien frío con una rodaja de limón..."
              value={form.tip}
              onChange={(e) => setForm((p) => ({ ...p, tip: e.target.value }))}
              className="w-full bg-white dark:bg-[#0f0f23] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl px-4 py-2.5 text-sm text-[#2C1810] dark:text-[#FFF8F0] placeholder-[#9B7A6A] outline-none focus:border-[#4ECDC4] transition-colors"
            />
          </section>
        </div>

        {/* Footer con botones */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#EDD9C8] dark:border-[#3a3a5c] flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border-2 border-[#EDD9C8] dark:border-[#3a3a5c] text-sm font-medium text-[#9B7A6A] hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all duration-200 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <i className="bi bi-arrow-repeat animate-spin">{""}</i>
                Guardando...
              </span>
            ) : (
              "Guardar Receta"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

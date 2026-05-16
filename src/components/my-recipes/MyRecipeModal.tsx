"use client";
import { useState } from "react";
import { IMyRecipe } from "@/types/IMyRecipe";

interface Props {
  recipe: IMyRecipe;
  onClose: () => void;
  // TODO BACKEND: onDelete llamará a DELETE /api/my-recipes/{id}/
  onDelete: (id: number) => void;
}

// Mensajes de cierre — MANTENER: 100% frontend
const CLOSING_NOTES = [
  "🍹 ¡Salud! Esta es tu creación especial.",
  "✨ Hecha con tus manos y mucho sabor. ¡Disfrútala!",
  "🌴 Tu cóctel favorito, porque lo hiciste tú.",
  "🎉 ¡El mejor bartender eres tú!",
  "🍊 Receta exclusiva. Solo para los que saben.",
];

export default function MyRecipeModal({ recipe, onClose, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const closingNote = CLOSING_NOTES[recipe.id % CLOSING_NOTES.length];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1a2e] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen hero */}
        <div className="relative h-56 bg-[#FFF3EA] dark:bg-[#0f0f23] flex-shrink-0">
          {recipe.image ? (
            // TODO BACKEND: imagen viene del back
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <i className="bi bi-cup-straw text-6xl text-[#EDD9C8] dark:text-[#3a3a5c]">
                {""}
              </i>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer"
            aria-label="Cerrar"
          >
            <i className="bi bi-x-lg text-sm">{""}</i>
          </button>

          {/* Botón eliminar */}
          <button
            onClick={() => setConfirmDelete(true)}
            // TODO BACKEND: conectar con DELETE /api/my-recipes/{id}/
            className="absolute top-4 right-4 w-9 h-9 bg-black/60 hover:bg-[#FF6B6B] backdrop-blur-md border border-white/30 hover:border-[#FF6B6B] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer"
            aria-label="Eliminar receta"
          >
            <i className="bi bi-trash3 text-sm">{""}</i>
          </button>

          {/* Nombre, descripción y etiquetas */}
          {/* TODO BACKEND: name, description, difficulty, isAlcoholic, ingredients.length vienen del back */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-bold bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white px-2 py-0.5 rounded-full">
                Mi receta
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1 drop-shadow-md">
              {recipe.name}
            </h2>
            {recipe.description && (
              <p className="text-white/85 text-xs leading-relaxed mb-3 drop-shadow-sm">
                {recipe.description}
              </p>
            )}
            <div className="flex gap-2 flex-wrap">
              <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/20 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                <i className="bi bi-bar-chart text-[9px]">{""}</i>
                {recipe.difficulty}
              </span>
              <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/20 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                <i
                  className={`bi ${recipe.isAlcoholic ? "bi-droplet-fill" : "bi-droplet"} text-[9px]`}
                >
                  {""}
                </i>
                {recipe.isAlcoholic ? "Alcohólico" : "Sin alcohol"}
              </span>
              <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/20 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                <i className="bi bi-list-ul text-[9px]">{""}</i>
                {recipe.ingredients.length} ingredientes
              </span>
            </div>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto custom-scroll px-5 py-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Ingredientes */}
            {/* TODO BACKEND: lista de ingredientes viene del back */}
            <div>
              <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#FFF8F0] mb-3 flex items-center gap-1.5">
                Ingredientes
              </h3>
              <div className="flex flex-col gap-2">
                {recipe.ingredients.map((ing, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1 border-b border-[#EDD9C8]/50 dark:border-[#3a3a5c]/50 last:border-0"
                  >
                    <span className="flex items-center gap-1.5 font-medium text-[#2C1810] dark:text-[#FFF8F0]">
                      <i className="bi bi-check-circle-fill text-green-500 text-xs flex-shrink-0">
                        {""}
                      </i>
                      {ing.name}
                    </span>
                    <span className="text-[#9B7A6A] dark:text-[#a89088] ml-2 flex-shrink-0">
                      {ing.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparación */}
            {/* TODO BACKEND: pasos vienen del back */}
            <div>
              <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#FFF8F0] mb-3 flex items-center gap-1.5">
                Preparación
              </h3>
              <div className="flex flex-col gap-3">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-[#FF6B6B] text-white flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <p className="text-[#9B7A6A] dark:text-[#a89088] leading-relaxed">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tip */}
          {/* TODO BACKEND: tip viene del back */}
          {recipe.tip && (
            <div className="mt-4 bg-[#FFF3EA] dark:bg-[#16213e] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl p-3 flex gap-2">
              <span>🍊</span>
              <p className="text-xs text-[#9B7A6A] dark:text-[#a89088] italic">
                {recipe.tip}
              </p>
            </div>
          )}

          {/* Nota de cierre — MANTENER: 100% frontend */}
          <div className="mt-3 bg-gradient-to-r from-[#FF6B6B]/10 to-[#4ECDC4]/10 border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl p-3">
            <p className="text-xs text-[#9B7A6A] dark:text-[#a89088] italic text-center">
              {closingNote}
            </p>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      {/* TODO BACKEND: al confirmar llamar DELETE /api/my-recipes/{recipe.id}/ */}
      {confirmDelete && (
        <div
          className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-[#1a1a2e] rounded-2xl p-6 mx-6 shadow-2xl flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FF6B6B]/15 flex items-center justify-center">
                <i className="bi bi-trash3 text-[#FF6B6B] text-xl">{""}</i>
              </div>
              <h3 className="font-bold text-[#2C1810] dark:text-[#FFF8F0]">
                ¿Eliminar receta?
              </h3>
              <p className="text-xs text-[#9B7A6A]">
                Se eliminará &ldquo;<strong>{recipe.name}</strong>&rdquo;
                permanentemente. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-2 rounded-xl border-2 border-[#EDD9C8] dark:border-[#3a3a5c] text-sm font-medium text-[#9B7A6A] hover:border-[#4ECDC4] transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDelete(recipe.id);
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl bg-[#FF6B6B] text-white text-sm font-medium hover:bg-[#ff5252] transition-all cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

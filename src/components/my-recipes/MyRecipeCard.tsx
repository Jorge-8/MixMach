"use client";
import { IMyRecipe } from "@/types/IMyRecipe";

interface Props {
  recipe: IMyRecipe;
  onClick: () => void;
  // TODO BACKEND: onDelete llamará a DELETE /api/my-recipes/{id}/
  onDelete: (id: number) => void;
}

function difficultyColor(d: string) {
  if (d === "Fácil") return "text-green-600 dark:text-green-400";
  if (d === "Medio") return "text-amber-600 dark:text-amber-400";
  return "text-[#FF6B6B]";
}

export default function MyRecipeCard({ recipe, onClick, onDelete }: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white  dark:bg-[#1a1a2e] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative"
    >
      {/* Imagen */}
      <div className="relative h-44 bg-[#FFF3EA] dark:bg-[#0f0f23] overflow-hidden">
        {recipe.image ? (
          // TODO BACKEND: imagen viene del back
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <i className="bi bi-cup-straw text-4xl text-[#EDD9C8] dark:text-[#3a3a5c]">
              {""}
            </i>
            <p className="text-xs text-[#9B7A6A]">Sin imagen</p>
          </div>
        )}

        {/* Badge dificultad */}
        {/* TODO BACKEND: difficulty viene del back */}
        {/* <div className="absolute top-3 left-3 bg-white/85 dark:bg-black/60 backdrop-blur-sm text-[#2C1810] dark:text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
          <i className="bi bi-star text-[9px]">{""}</i>
          <span>{recipe.difficulty}</span>
        </div> */}

        {/* Badge "Mi receta" */}
        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
          Mi receta
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Nombre */}
        <h3 className="font-bold text-[#2C1810] dark:text-[#FFF8F0] text-sm mb-1.5 line-clamp-1">
          {/* TODO BACKEND: name viene del back */}
          {recipe.name}
        </h3>

        {/* Meta: dificultad + tipo + ingredientes */}
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <span
            className={`text-xs bi bi-star font-medium flex items-center gap-1 ${difficultyColor(recipe.difficulty)}`}
          >
            {recipe.difficulty}
          </span>
          <span className="text-xs text-[#9B7A6A] dark:text-[#a89088] flex items-center gap-1">
            <i
              className={`bi ${recipe.isAlcoholic ? "bi-droplet-fill" : "bi-droplet"} text-xs`}
            >
              {""}
            </i>
            {recipe.isAlcoholic ? "Alcohólico" : "Sin alcohol"}
          </span>
          <span className="text-xs text-[#9B7A6A] dark:text-[#a89088] flex items-center gap-1">
            <i className="bi bi-list-ul text-xs">{""}</i>
            {recipe.ingredients.length} ing.
          </span>
        </div>

        {/* Botón eliminar */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // evitar que abra el modal
            onDelete(recipe.id);
          }}
          // TODO BACKEND: onDelete llamará a DELETE /api/my-recipes/{id}/
          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-[#FF6B6B]/30 text-[#FF6B6B] text-xs font-medium hover:bg-[#FF6B6B] hover:text-white hover:border-[#FF6B6B] transition-all duration-200 cursor-pointer"
        >
          <i className="bi bi-trash3 text-xs">{""}</i>
          Eliminar receta
        </button>
      </div>
    </div>
  );
}

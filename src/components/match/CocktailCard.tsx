"use client";
import { ICocktail } from "@/types/ICocktail";

interface Props {
  cocktail: ICocktail;
  match?: { matched: number; total: number; pct: number };
  // MANTENER: mode controla qué info muestra la card
  // "ingredients" → barra de match + % (inicio)
  // "browse"      → dificultad + num ingredientes (match/búsqueda)
  mode?: "ingredients" | "browse";
  onClick: () => void;
}

// MANTENER: funciones de color — no cambian con el back
function barColor(pct: number) {
  if (pct === 100) return "bg-green-500";
  if (pct >= 70) return "bg-amber-400";
  return "bg-[#FF6B6B]";
}
function badgeColor(pct: number) {
  if (pct === 100) return "bg-green-500 text-white";
  if (pct >= 70) return "bg-amber-400 text-white";
  return "bg-[#FF6B6B] text-white";
}

function difficultyColor(d: string) {
  if (d === "Fácil") return "text-green-600 dark:text-green-400";
  if (d === "Medio") return "text-amber-600 dark:text-amber-400";
  return "text-[#FF6B6B]";
}

export default function CocktailCard({
  cocktail,
  match,
  mode = "ingredients",
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#1a1a2e] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
    >
      {/* Imagen — TODO BACKEND: la URL viene del back */}
      <div className="relative h-44 bg-gray-100 dark:bg-[#16213e] overflow-hidden">
        {cocktail.image ? (
          <img
            src={cocktail.image}
            alt={cocktail.name}
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

        {/* Badge dificultad — TODO BACKEND: viene del back */}
        <div className="absolute top-3 left-3 bg-white/80 dark:bg-black/50 backdrop-blur-sm text-[#2C1810] dark:text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
          <i className="bi bi-star text-[9px]">{""}</i>
          <span>{cocktail.difficulty}</span>
        </div>

        {/* Badge derecho — cambia según mode */}
        {mode === "ingredients" && match && (
          // TODO BACKEND: BORRAR cálculo, vendrá del back
          <div
            className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor(match.pct)}`}
          >
            {match.pct}%
          </div>
        )}
        {mode === "browse" && (
          // MANTENER: num ingredientes viene del back
          <div className="absolute top-3 right-3 bg-white/80 dark:bg-black/50 backdrop-blur-sm text-[#2C1810] dark:text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
            <i className="bi bi-list-ul text-[10px]">{""}</i>
            <span>{cocktail.ingredients.length} ing.</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Nombre — TODO BACKEND: viene del back */}
        <h3 className="font-bold text-[#2C1810] dark:text-[#FFF8F0] text-sm mb-2">
          {cocktail.name}
        </h3>

        {/* Modo ingredients: barra de match + estado */}
        {mode === "ingredients" && match && (
          <>
            {/* TODO BACKEND: BORRAR cálculo, vendrá del back */}
            <div className="w-full bg-gray-100 dark:bg-[#3a3a5c] rounded-full h-1.5 mb-2">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${barColor(match.pct)}`}
                style={{ width: `${match.pct}%` }}
              />
            </div>
            {match.pct === 100 ? (
              <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                <i className="bi bi-check-circle-fill">{""}</i>
                ¡Tienes todo!
              </p>
            ) : (
              <p className="text-xs text-[#9B7A6A] dark:text-[#a89088]">
                Faltan{" "}
                <span className="font-bold text-[#FF6B6B]">
                  {match.total - match.matched} ingredientes
                </span>
              </p>
            )}
          </>
        )}

        {/* Modo browse: dificultad + tipo + num ingredientes */}
        {mode === "browse" && (
          // TODO BACKEND: dificultad, isAlcoholic, num ingredientes vienen del back
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`text-xs font-medium flex items-center gap-1 ${difficultyColor(cocktail.difficulty)}`}
            >
              {cocktail.difficulty}
            </span>
            <span className="text-xs text-[#9B7A6A] dark:text-[#a89088] flex items-center gap-1">
              <i
                className={`bi ${cocktail.isAlcoholic ? "bi-droplet-fill" : "bi-droplet"} text-xs`}
              >
                {""}
              </i>
              {cocktail.isAlcoholic ? "Alcohólico" : "Sin alcohol"}
            </span>
            <span className="text-xs text-[#9B7A6A] dark:text-[#a89088] flex items-center gap-1">
              <i className="bi bi-list-ul text-xs">{""}</i>
              {cocktail.ingredients.length} ing.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

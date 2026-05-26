"use client";
// CAMBIO: se eliminó useState (ya no maneja favorito localmente)
// Se agregó useFavorites del context global
import { ICocktail } from "@/types/ICocktail";
import { ingredientMatches } from "@/utils/normalize";
import { useFavorites } from "@/context/FavoritesContext";

interface Props {
  cocktail: ICocktail;
  match?: { matched: number; total: number; pct: number };
  selectedIngredients?: string[];
  mode?: "ingredients" | "browse";
  onClose: () => void;
}

function barColor(pct: number) {
  if (pct === 100) return "bg-green-500";
  if (pct >= 70) return "bg-amber-400";
  return "bg-[#FF6B6B]";
}

// MANTENER: mensajes de cierre — 100% frontend, no viene del back
const CLOSING_NOTES = [
  "🍹 ¡Salud! Disfruta cada sorbo con buena compañía.",
  "🌴 La vida es mejor con un buen cóctel en la mano.",
  "✨ Hecho con amor — ¡que lo disfrutes al máximo!",
  "🎉 El secreto del mejor cóctel eres tú. ¡Salud!",
  "🍊 Fresco, delicioso y hecho por ti. ¡Disfrútalo!",
];

export default function CocktailModal({
  cocktail,
  match,
  selectedIngredients = [],
  mode = "ingredients",
  onClose,
}: Props) {
  // ─────────────────────────────────────────────────────────────
  // CAMBIO: isFavorite ahora viene del context global (FavoritesContext)
  // en lugar de useState local. Esto permite que la página de favoritos
  // se actualice en tiempo real al presionar el corazón aquí.
  //
  // TODO BACKEND: cuando se conecte, FavoritesContext llamará automáticamente
  // a POST /api/favorites/ o DELETE /api/favorites/{id}/
  // No hay que cambiar nada en este componente al conectar el back.
  // ─────────────────────────────────────────────────────────────
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(cocktail.id);

  // MANTENER: nota de cierre fija para esta receta
  const closingNote = CLOSING_NOTES[cocktail.id % CLOSING_NOTES.length];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1a2e] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Imagen hero ── */}
        <div className="relative h-56 bg-gray-200 dark:bg-[#16213e] flex-shrink-0">
          {cocktail.image ? (
            // TODO BACKEND: imagen viene del back
            <img
              src={cocktail.image}
              alt={cocktail.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              <i className="bi bi-cup-straw text-4xl text-[#EDD9C8] dark:text-[#3a3a5c]">
                {""}
              </i>
              <p className="text-xs text-[#9B7A6A]">Sin imagen</p>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer"
            aria-label="Cerrar"
          >
            <i className="bi bi-x-lg text-sm font-bold">{""}</i>
          </button>

          {/* Favorito — CAMBIO: usa context global en lugar de estado local */}
          <button
            onClick={() => toggleFavorite(cocktail.id)}
            className={`absolute top-4 right-4 w-9 h-9 backdrop-blur-md border rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-150 cursor-pointer
              ${
                fav
                  ? "bg-[#FF6B6B] border-[#FF6B6B] text-white"
                  : "bg-black/60 border-white/30 text-white hover:bg-[#FF6B6B]/80 hover:border-[#FF6B6B]"
              }`}
            aria-label={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            <i className={`bi ${fav ? "bi-heart-fill" : "bi-heart"} text-sm`}>
              {""}
            </i>
          </button>

          {/* Nombre, descripción y etiquetas — TODO BACKEND: vienen del back */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-xl font-bold text-white mb-1 drop-shadow-md">
              {cocktail.name}
            </h2>
            <p className="text-white/85 text-xs leading-relaxed mb-3 drop-shadow-sm">
              {cocktail.description}
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/20 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                <i className="bi bi-bar-chart text-[9px]">{""}</i>
                {cocktail.difficulty}
              </span>
              <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/20 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                <i
                  className={`bi ${cocktail.isAlcoholic ? "bi-droplet-fill" : "bi-droplet"} text-[9px]`}
                >
                  {""}
                </i>
                {cocktail.isAlcoholic ? "Alcohólico" : "Sin alcohol"}
              </span>
              <span className="flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/20 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                <i className="bi bi-list-ul text-[9px]">{""}</i>
                {cocktail.ingredients.length} ingredientes
              </span>
            </div>
          </div>
        </div>

        {/* ── Barra de match — solo en modo ingredients ── */}
        {/* TODO BACKEND: BORRAR este bloque — el back calculará el match */}
        {mode === "ingredients" && match && (
          <div
            className={`mx-5 mt-4 rounded-xl p-3 flex-shrink-0 ${match.pct === 100 ? "bg-green-50 dark:bg-green-900/20" : "bg-[#FFF3EA] dark:bg-[#16213e]"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {match.pct === 100 && (
                <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <i className="bi bi-check text-white text-xs">{""}</i>
                </span>
              )}
              <p
                className={`text-sm font-semibold ${match.pct === 100 ? "text-green-600 dark:text-green-400" : "text-[#2C1810] dark:text-[#FFF8F0]"}`}
              >
                {match.pct === 100
                  ? "¡Tienes todos los ingredientes!"
                  : `Tienes ${match.matched} de ${match.total} ingredientes`}
              </p>
              <span className="ml-auto text-xs font-bold text-[#9B7A6A]">
                {match.pct}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-[#3a3a5c] rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${barColor(match.pct)}`}
                style={{ width: `${match.pct}%` }}
              />
            </div>
          </div>
        )}

        {/* ── Contenido scrolleable ── */}
        <div className="flex-1 overflow-y-auto custom-scroll px-5 py-4">
          <div className="grid grid-cols-2 gap-6">
            {/* Ingredientes — TODO BACKEND: lista viene del back */}
            <div>
              <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#FFF8F0] mb-3">
                Ingredientes
              </h3>
              <div className="flex flex-col gap-2">
                {cocktail.ingredients.map((ing, i) => {
                  // MANTENER: lógica de palomita cambia según mode
                  // "browse"      → siempre palomita
                  // "ingredients" → palomita si el usuario tiene el ingrediente
                  // TODO BACKEND: en modo ingredients, hasIt vendrá del back
                  const hasIt =
                    mode === "browse"
                      ? true
                      : selectedIngredients.some((s) =>
                          ingredientMatches(s, ing.name)
                        );

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs py-1 border-b border-[#EDD9C8]/50 dark:border-[#3a3a5c]/50 last:border-0"
                    >
                      <span
                        className={`flex items-center gap-1.5 font-medium ${hasIt ? "text-[#2C1810] dark:text-[#FFF8F0]" : "text-[#9B7A6A] dark:text-[#a89088]"}`}
                      >
                        {hasIt ? (
                          <i className="bi bi-check-circle-fill text-green-500 text-xs flex-shrink-0">
                            {""}
                          </i>
                        ) : (
                          <i className="bi bi-x-circle-fill text-[#FF6B6B] text-xs flex-shrink-0">
                            {""}
                          </i>
                        )}
                        {ing.name}
                      </span>
                      <span className="text-[#9B7A6A] dark:text-[#a89088] ml-2 flex-shrink-0">
                        {ing.amount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preparación — TODO BACKEND: pasos vienen del back */}
            <div>
              <h3 className="text-sm font-bold text-[#2C1810] dark:text-[#FFF8F0] mb-3">
                Preparación
              </h3>
              <div className="flex flex-col gap-3">
                {cocktail.steps.map((step, i) => (
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

          {/* Tip — TODO BACKEND: viene del back */}
          {cocktail.tip && (
            <div className="mt-4 bg-[#FFF3EA] dark:bg-[#16213e] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl p-3 flex gap-2">
              <span>🍊</span>
              <p className="text-xs text-[#9B7A6A] dark:text-[#a89088] italic">
                {cocktail.tip}
              </p>
            </div>
          )}

          {/* Nota de cierre — MANTENER: 100% frontend */}
          <div className="mt-3 bg-gradient-to-r from-[#FF6B6B]/10 to-[#4ECDC4]/10 border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl p-3">
            <p className="text-xs text-[#9B7A6A] dark:text-[#a89088] italic text-center w-full">
              {closingNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

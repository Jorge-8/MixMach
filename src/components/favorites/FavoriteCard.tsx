"use client";
import { ICocktail } from "@/types/ICocktail";
import { useFavorites } from "@/context/FavoritesContext";

interface Props {
  cocktail: ICocktail;
  onClick: () => void;
}

function difficultyColor(d: string) {
  if (d === "Fácil") return "text-green-600 dark:text-green-400";
  if (d === "Medio") return "text-amber-600 dark:text-amber-400";
  return "text-[#FF6B6B]";
}

export default function FavoriteCard({ cocktail, onClick }: Props) {
  // MANTENER: useFavorites consume el context global para el botón de corazón
  // TODO BACKEND: cuando se conecte, toggleFavorite llama al endpoint de favoritos
  const { toggleFavorite } = useFavorites();

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-[#1a1a2e] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
    >
      {/* Imagen */}
      <div className="relative h-44 bg-[#FFF3EA] dark:bg-[#0f0f23] overflow-hidden">
        {cocktail.image ? (
          // TODO BACKEND: imagen viene del back
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

        {/* Botón corazón — siempre rojo lleno porque solo aparece en favoritos */}
        {/* TODO BACKEND: toggleFavorite llama DELETE /api/favorites/{id}/ al quitar */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(cocktail.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-90 transition-all duration-150 cursor-pointer"
          aria-label="Quitar de favoritos"
        >
          <i className="bi bi-heart-fill text-white text-sm">{""}</i>
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Nombre */}
        {/* TODO BACKEND: name viene del back */}
        <h3 className="font-bold text-[#2C1810] dark:text-[#FFF8F0] text-sm mb-2 line-clamp-1">
          {cocktail.name}
        </h3>

        {/* Meta */}
        {/* TODO BACKEND: difficulty, isAlcoholic vienen del back */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`text-xs bi bi-star font-medium flex items-center gap-1  ${difficultyColor(cocktail.difficulty)}`}
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
      </div>
    </div>
  );
}

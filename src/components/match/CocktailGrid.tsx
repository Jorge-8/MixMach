"use client";
import { useState } from "react";
import CocktailCard from "./CocktailCard";
import CocktailModal from "./CocktailModal";
import { ICocktail } from "@/types/ICocktail";
import { ingredientMatches } from "@/utils/normalize";
import { useCocktails } from "@/hooks/useCocktails";

interface Props {
  selectedIngredients: string[];
}

// MANTENER: función de match — adapta para aceptar dos formas de ingrediente
// (frontend mock: { name }  o backend: { ingredient: { name } })
function getMatch(cocktail: ICocktail, selected: string[]) {
  if (selected.length === 0) {
    return {
      matched: 0,
      total: cocktail.ingredients.length,
      pct: 0,
    };
  }

  const matched = cocktail.ingredients.filter((ing: any) => {
    const ingName = ing.name ?? ing.ingredient?.name ?? "";
    return selected.some((s) => ingredientMatches(s, ingName));
  }).length;

  const total = cocktail.ingredients.length;
  const pct = total === 0 ? 0 : Math.round((matched / total) * 100);

  return {
    matched,
    total,
    pct,
  };
}

export default function CocktailGrid({ selectedIngredients }: Props) {
  const [selected, setSelected] = useState<ICocktail | null>(null);

  // Hook que consulta los cócteles de la plataforma y aplica (si corresponde) filtrado/orden
  const { cocktails, loading, error } = useCocktails(selectedIngredients);

  // MANTENER: estado vacío cuando no hay ingredientes seleccionados
  if (selectedIngredients.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
        <span className="text-6xl">🍹</span>
        <h1 className="text-2xl font-bold text-[#2C1810] bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
          ¿Qué tienes hoy?
        </h1>
        <p className="text-sm text-[#9B7A6A] dark:text-[#a89088]">
          Selecciona tus ingredientes y encontramos el cóctel perfecto
        </p>
      </div>
    );
  }

  // Mientras carga o hay error tras seleccionar ingredientes
  if (loading) return <p className="p-8 text-[#9B7A6A]">Buscando cócteles...</p>;
  if (error) return <p className="p-8 text-red-400">{error}</p>;

  // MANTENER: estado vacío cuando no hay coincidencias
  if (!cocktails || cocktails.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
        <span className="text-5xl bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
          <i className="bi bi-bug"></i>
        </span>
        <h2 className="text-xl font-bold text-[#2C1810] bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
          Sin resultados
        </h2>
        <p className="text-sm text-[#9B7A6A] dark:text-[#a89088]">
          No encontramos cócteles con esos ingredientes. Intenta agregar más.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6">
      {/* Header resultados — MANTENER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#2C1810] dark:text-[#FFF8F0]">
            Cócteles recomendados
          </h2>
          <p className="text-xs text-[#9B7A6A] dark:text-[#a89088] mt-0.5">
            {cocktails.length} recetas coinciden · ordenadas por compatibilidad
          </p>
        </div>

        {/* Leyenda — MANTENER */}
        <div className="flex items-center gap-3 text-xs text-[#9B7A6A]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            100%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            ≥70%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6B6B] inline-block" />
            ≥40%
          </span>
        </div>
      </div>

      {/* Grid — MANTENER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cocktails.map((cocktail) => {
          // keep client-side match as a fallback (backend can return _match later)
          const match = getMatch(cocktail as ICocktail, selectedIngredients);
          return (
            <CocktailCard
              key={cocktail.id}
              cocktail={cocktail as ICocktail}
              match={match}
              onClick={() => setSelected(cocktail as ICocktail)}
            />
          );
        })}
      </div>

      {/* Modal — MANTENER */}
      {selected && (
        <CocktailModal
          cocktail={selected}
          match={getMatch(selected, selectedIngredients)}
          selectedIngredients={selectedIngredients}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
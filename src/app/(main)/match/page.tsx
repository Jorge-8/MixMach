"use client";
import { useState } from "react";
import BeverageSidebar, {
  BeverageFilters,
} from "@/components/ingredients/BeverageSidebar";
import CocktailCard from "@/components/match/CocktailCard";
import CocktailModal from "@/components/match/CocktailModal";
import { ICocktail } from "@/types/ICocktail";
import { normalizeText } from "@/utils/normalize";

// ═══════════════════════════════════════════════════════════════
// TODO BACKEND: eliminar este import cuando se conecte al back
// Reemplazar con: const { cocktails } = useCocktails(selectedBeverages, filters);
// ═══════════════════════════════════════════════════════════════
import { ALL_COCKTAILS } from "@/components/match/CocktailGrid";
// ═══════════════════════════════════════════════════════════════

export default function MatchPage() {
  const [selectedBeverages, setSelectedBeverages] = useState<string[]>([]);
  const [filters, setFilters] = useState<BeverageFilters>({
    difficulty: null,
    drinkType: null,
    maxIngr: null,
  });
  const [selected, setSelected] = useState<ICocktail | null>(null);

  // ─────────────────────────────────────────────────────────────
  // TODO BACKEND: BORRAR este bloque — el back filtra y devuelve los cócteles
  // El back recibe: selectedBeverages (nombres) + filters y devuelve ICocktail[]
  // ─────────────────────────────────────────────────────────────
  const cocktails = (() => {
    let result =
      selectedBeverages.length === 0
        ? ALL_COCKTAILS
        : ALL_COCKTAILS.filter((c) =>
            selectedBeverages.some((name) =>
              normalizeText(c.name).includes(normalizeText(name))
            )
          );

    // Filtro dificultad
    if (filters.difficulty) {
      const map: Record<string, string> = {
        facil: "Fácil",
        medio: "Medio",
        dificil: "Difícil",
      };
      result = result.filter((c) => c.difficulty === map[filters.difficulty!]);
    }

    // Filtro tipo
    if (filters.drinkType === "alcohol")
      result = result.filter((c) => c.isAlcoholic);
    if (filters.drinkType === "sin-alcohol")
      result = result.filter((c) => !c.isAlcoholic);

    // Filtro máximo ingredientes
    if (filters.maxIngr) {
      result = result.filter((c) => c.ingredients.length <= filters.maxIngr!);
    }

    return result;
  })();
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full">
      <BeverageSidebar
        onChange={setSelectedBeverages}
        onFiltersChange={setFilters}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Estado vacío — MANTENER */}
        {cocktails.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <span className="text-5xl bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
              <i className="bi bi-bug"></i>
            </span>
            <h2 className="text-xl font-bold text-[#2C1810] dark:text-[#FFF8F0] bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
              Sin resultados
            </h2>
            <p className="text-sm text-[#9B7A6A] dark:text-[#a89088]">
              Prueba cambiando los filtros o buscando otra bebida.
            </p>
          </div>
        )}

        {/* Grid — MANTENER */}
        {cocktails.length > 0 && (
          <div className="flex-1 overflow-y-auto custom-scroll p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-[#2C1810] dark:text-[#FFF8F0]">
                  Catálogo de bebidas
                </h2>
                <p className="text-xs text-[#9B7A6A] dark:text-[#a89088] mt-0.5">
                  {cocktails.length} bebidas encontradas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cocktails.map((cocktail) => (
                <CocktailCard
                  key={cocktail.id}
                  cocktail={cocktail}
                  mode="browse"
                  onClick={() => setSelected(cocktail)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal — mode="browse": todos los ingredientes con palomita, sin barra */}
        {selected && (
          <CocktailModal
            cocktail={selected}
            mode="browse"
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}

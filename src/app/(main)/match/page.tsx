"use client";
import { useState } from "react";
import BeverageSidebar, {
  BeverageFilters,
} from "@/components/ingredients/BeverageSidebar";
import CocktailCard from "@/components/match/CocktailCard";
import CocktailModal from "@/components/match/CocktailModal";
import { ICocktail } from "@/types/ICocktail";
import { useCocktails } from "@/hooks/useCocktails";
import { normalizeText } from "@/utils/normalize";

export default function MatchPage() {
  const [selectedBeverages, setSelectedBeverages] = useState<string[]>([]);
  const [filters, setFilters] = useState<BeverageFilters>({
    difficulty: null,
    drinkType: null,
    maxIngr: null,
  });
  const [selected, setSelected] = useState<ICocktail | null>(null);

  // Hook que consulta al backend y aplica (si corresponde) filtrado/orden
  const { cocktails, loading, error } = useCocktails(selectedBeverages, filters);

  // Estado vacío mientras carga
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-[#9B7A6A]">Cargando bebidas…</p>
      </div>
    );
  }

  // Error al cargar
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <BeverageSidebar
        onChange={setSelectedBeverages}
        onFiltersChange={setFilters}
      />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Estado vacío — cuando no hay bebidas encontradas */}
        {(!cocktails || cocktails.length === 0) && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <span className="text-5xl bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
              <i className="bi bi-bug"></i>
            </span>
            <h2 className="text-xl font-bold text-[#2C1810] bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
              Sin resultados
            </h2>
            <p className="text-sm text-[#9B7A6A] dark:text-[#a89088]">
              Prueba cambiando los filtros o buscando otra bebida.
            </p>
          </div>
        )}

        {/* Grid — MANTENER */}
        {cocktails && cocktails.length > 0 && (
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
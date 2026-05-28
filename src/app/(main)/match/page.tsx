"use client";
import { useState, useCallback } from "react";
import BeverageSidebar, { BeverageFilters } from "@/components/ingredients/BeverageSidebar";
import CocktailCard from "@/components/match/CocktailCard";
import CocktailModal from "@/components/match/CocktailModal";
import { ICocktail } from "@/types/ICocktail";
import { useMatchCocktails } from "@/hooks/useMatchCocktails";

export default function MatchPage() {

  const [selectedBeverages, setSelectedBeverages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState<BeverageFilters>({
    difficulty: null,
    is_alcoholic: null,
    maxIngr: null,
  });

  const [selected, setSelected] = useState<ICocktail | null>(null);

  const handleBeverageChange = useCallback((s: string[]) => setSelectedBeverages(s), []);
  const handleFiltersChange = useCallback((f: BeverageFilters) => setFilters(f), []);

  const { cocktails, loading, error } = useMatchCocktails(selectedBeverages, filters, searchQuery);

  if (error) return (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-sm text-red-400">{error}</p>
    </div>
  );

  return (

    <div className="flex h-full">

      <BeverageSidebar
        onChange={handleBeverageChange}
        onFiltersChange={handleFiltersChange}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex flex-col overflow-hidden">

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

        {cocktails && cocktails.length > 0 && (
          <div className="flex-1 overflow-y-auto custom-scroll p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-[#2C1810] dark:text-[#FFF8F0]">
                  Catálogo de bebidas
                </h2>
                <p className="text-xs text-[#9B7A6A] dark:text-[#a89088] mt-0.5">
                  {loading ? "Filtrando..." : `${cocktails.length} bebidas encontradas`}
                  
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
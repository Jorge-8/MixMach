"use client";
import { useState } from "react";
import IngredientSidebar from "@/components/ingredients/IngredientSidebar";
import CocktailGrid from "@/components/match/CocktailGrid";

export default function HomePage() {
  // MANTENER: este estado conecta el sidebar con el grid
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  return (
    <div className="flex h-full">
      <IngredientSidebar
        showFilters={false}
        // MANTENER: onChange actualiza el grid en tiempo real
        onChange={setSelectedIngredients}
      />
      <CocktailGrid selectedIngredients={selectedIngredients} />
    </div>
  );
}

//import { useState, useEffect } from "react";
import { getPlatformCocktails } from "@/services/cocktailService";
import { ICocktail } from "@/types/ICocktail";
import { ingredientMatches } from "@/utils/normalize";

import { useState, useEffect, useRef } from "react";

export function useCocktails(selectedIngredients: string[]) {
  const [cocktails, setCocktails] = useState<ICocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Serializar el array para que la comparación sea por valor, no por referencia
  const depsKey = selectedIngredients.slice().sort().join(",");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getPlatformCocktails();
        if (!mounted) return;
        if (!selectedIngredients || selectedIngredients.length === 0) {
          setCocktails(data);
        } else {
          const withMatch = data
            .map((c) => {
              const matched = c.ingredients.filter((ing: any) =>
                selectedIngredients.some((s) =>
                  ingredientMatches(s, ing.ingredient?.name ?? ing.name)
                )
              ).length;
              const total = c.ingredients.length;
              const pct = total === 0 ? 0 : Math.round((matched / total) * 100);
              return { ...c, _match: { matched, total, pct } };
            })
            .filter((c) => c._match.matched > 0)
            .sort((a, b) => b._match.pct - a._match.pct);
          setCocktails(withMatch as unknown as ICocktail[]);
        }
      } catch (err: any) {
        if (mounted) setError(err.message || "Error cargando cócteles");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [depsKey]); // ← string estable, no el array

  return { cocktails, loading, error };
}
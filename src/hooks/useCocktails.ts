import { getPlatformCocktails } from "@/services/cocktailService";
import { ICocktail } from "@/types/ICocktail";
import { ingredientMatches } from "@/utils/normalize";
import { useState, useEffect, useRef } from "react";
import { BeverageFilters } from "@/components/ingredients/BeverageSidebar";

export function useCocktails(selectedIngredients: string[], filters?: BeverageFilters) {
  const [cocktails, setCocktails] = useState<ICocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const depsKey = selectedIngredients.slice().sort().join(",");
  // Serializar filtros también para detectar cambios
  const filterKey = JSON.stringify(filters ?? {});

  const prevDepsKey = useRef(depsKey + filterKey);
  if (prevDepsKey.current !== depsKey + filterKey) {
    prevDepsKey.current = depsKey + filterKey;
    setLoading(true);
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        let data = await getPlatformCocktails();
        if (!mounted) return;

        // Aplicar filtros
        if (filters?.difficulty) {
          const map: Record<string, string> = {
            facil: "Fácil",
            medio: "Medio",
            dificil: "Difícil",
          };
          const target = map[filters.difficulty];
          data = data.filter((c) => c.difficulty === target);
        }
        if (filters?.is_alcoholic === "alcohol") {
          data = data.filter((c) => c.isAlcoholic === true);
        } else if (filters?.is_alcoholic === "sin-alcohol") {
          data = data.filter((c) => c.isAlcoholic === false);
        }
        if (filters?.maxIngr) {
          data = data.filter((c) => c.ingredients.length <= filters.maxIngr!);
        }

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
  }, [depsKey, filterKey]); // ← ambos keys

  return { cocktails, loading, error };
}
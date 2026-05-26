// @/hooks/useMatchCocktails.ts
import { getPlatformCocktails } from "@/services/cocktailService";
import { ICocktail } from "@/types/ICocktail";
import { normalizeText } from "@/utils/normalize";
import { useState, useEffect } from "react";
import { BeverageFilters } from "@/components/ingredients/BeverageSidebar";

export function useMatchCocktails(selectedBeverages: string[], filters: BeverageFilters) {
  const [cocktails, setCocktails] = useState<ICocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const depsKey = selectedBeverages.slice().sort().join(",");
  const filterKey = [
    filters.difficulty ?? "",
    filters.is_alcoholic ?? "",
    filters.maxIngr ?? "",
  ].join("|");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        let data = await getPlatformCocktails();
        if (!mounted) return;

        if (filters.difficulty) {
          const map: Record<string, string> = { facil: "Fácil", medio: "Medio", dificil: "Difícil" };
          data = data.filter((c) => c.difficulty === map[filters.difficulty!]);
        }
        if (filters.is_alcoholic === "alcohol") data = data.filter((c) => c.isAlcoholic === true);
        if (filters.is_alcoholic === "sin-alcohol") data = data.filter((c) => c.isAlcoholic === false);
        if (filters.maxIngr) data = data.filter((c) => c.ingredients.length <= filters.maxIngr!);

        if (selectedBeverages.length === 0) {
          setCocktails(data);
        } else {
          setCocktails(data.filter((c) =>
            selectedBeverages.some((s) => normalizeText(c.name).includes(normalizeText(s)))
          ));
        }
      } catch (err: any) {
        if (mounted) setError(err.message || "Error cargando cócteles");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [depsKey, filterKey]); // ← sin filters en deps, filterKey ya lo cubre

  return { cocktails, loading, error };
}
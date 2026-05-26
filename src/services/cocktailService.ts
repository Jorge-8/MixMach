import { API_BASE_URL } from "@/constants";
import { ICocktail } from "@/types/ICocktail";

function mapCocktail(raw: any): ICocktail {
  return {
    ...raw,
    // snake_case a camelCase
    isAlcoholic: raw.is_alcoholic ?? raw.isAlcoholic ?? false,
    // aplanar ingredientes al formato que se espera
    ingredients: (raw.ingredients ?? []).map((ing: any) => ({
      id: ing.id,
      name: ing.ingredient?.name ?? ing.name ?? "",
      amount: ing.quantity && ing.unit ? `${ing.quantity} ${ing.unit}` : ing.amount ?? "",
    })),
  };
}

export async function getPlatformCocktails(): Promise<ICocktail[]> {
  const res = await fetch(`${API_BASE_URL}/cocktails/platform/`, {
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) throw new Error("Error al obtener cócteles de la plataforma");
  const data = await res.json();
  return data.map(mapCocktail);
}
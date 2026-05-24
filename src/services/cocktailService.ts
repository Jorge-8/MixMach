import { API_BASE_URL } from "@/constants";
import { ICocktail } from "@/types/ICocktail";

export async function getPlatformCocktails(): Promise<ICocktail[]> {
  const res = await fetch(`${API_BASE_URL}/cocktails/platform/`, {
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Error al obtener cócteles de la plataforma");
  return res.json();
}
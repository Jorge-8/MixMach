import { API_BASE_URL } from "@/constants";
import { ICocktail } from "@/types/ICocktail";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function mapFavoriteCocktail(raw: any): ICocktail {
  const c = raw.cocktail;
  return {
    ...c,
    isAlcoholic: c.is_alcoholic ?? false,
    ingredients: (c.ingredients ?? []).map((ing: any) => ({
      id: ing.id,
      name: ing.ingredient?.name ?? ing.name ?? "",
      amount:
        ing.quantity && ing.unit
          ? `${ing.quantity} ${ing.unit}`
          : ing.amount ?? "",
    })),
  };
}

export const favoriteService = {
  async getAll(): Promise<ICocktail[]> {
    const res = await fetch(`${API_BASE_URL}/favorites/`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Error al obtener favoritos");
    const data = await res.json();
    return data.map(mapFavoriteCocktail);
  },

  async add(cocktailId: number): Promise<ICocktail> {
    const res = await fetch(`${API_BASE_URL}/favorites/`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ cocktail_id: cocktailId }),
    });
    if (!res.ok) throw new Error("Error al agregar favorito");
    const data = await res.json();
    return mapFavoriteCocktail(data);
  },

  async remove(cocktailId: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/favorites/${cocktailId}/`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Error al eliminar favorito");
  },
};

import { API_BASE_URL } from "@/constants";
import { IMyRecipe, IMyRecipeForm } from "@/types/IMyRecipe";
import { authService } from "@/services/authService";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function mapRecipe(raw: any): IMyRecipe {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description ?? "",
    difficulty: raw.difficulty,
    isAlcoholic: raw.is_alcoholic ?? raw.isAlcoholic ?? true,
    image: raw.image || null,
    ingredients: (raw.ingredients ?? []).map((ing: any) => ({
      name: ing.ingredient?.name ?? ing.name ?? "",
      amount:
        ing.quantity && ing.unit
          ? `${ing.quantity} ${ing.unit}`.trim()
          : ing.amount ?? "",
    })),
    steps: raw.steps ?? [],
    tip: raw.tip ?? "",
    createdAt: raw.created_at ?? new Date().toISOString(),
  };
}

export const myRecipeService = {
  async getAll(): Promise<IMyRecipe[]> {
    const res = await fetch(`${API_BASE_URL}/my-recipes/`, {
      headers: authHeaders(),
    });
    if (res.status === 401) { authService.handleUnauthorized(); return []; }
    if (!res.ok) throw new Error("Error al obtener las recetas");
    const data = await res.json();
    return data.map(mapRecipe);
  },

  async create(form: IMyRecipeForm): Promise<IMyRecipe> {
    const res = await fetch(`${API_BASE_URL}/my-recipes/`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        difficulty: form.difficulty,
        is_alcoholic: form.isAlcoholic,
        image: form.image || "",
        steps: form.steps,
        tip: form.tip || "",
        ingredients: form.ingredients,
      }),
    });
    if (res.status === 401) { authService.handleUnauthorized(); throw new Error("Sesión expirada"); }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error("POST /my-recipes/ error:", res.status, body);
      throw new Error(`Error al crear la receta (${res.status})`);
    }
    const data = await res.json();
    return mapRecipe(data);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/my-recipes/${id}/`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (res.status === 401) { authService.handleUnauthorized(); return; }
    if (!res.ok) throw new Error("Error al eliminar la receta");
  },
};

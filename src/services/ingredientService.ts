import { API_BASE_URL } from "@/constants";
import { ICategory } from "@/types/ICategory";

export async function getCategories(): Promise<ICategory[]> {
  const res = await fetch(`${API_BASE_URL}/ingredients/categories/`, {
    // MANTENER: estos headers no cambian
    headers: {
      "Content-Type": "application/json",
    },
  });

  // MANTENER: este manejo de error no cambia
  if (!res.ok) {
    throw new Error("Error al obtener las categorías de ingredientes");
  }

  return res.json();
}

export async function getIngredientsByCategory(categoryId: number): Promise<ICategory> {
  const res = await fetch(`${API_BASE_URL}/ingredients/categories/${categoryId}/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  // MANTENER: este manejo de error no cambia
  if (!res.ok) {
    throw new Error(`Error al obtener ingredientes de la categoría ${categoryId}`);
  }

  return res.json();
}
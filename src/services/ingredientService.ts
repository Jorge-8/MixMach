import { API_BASE_URL } from "@/constants";
import { ICategory } from "@/types/ICategory";

// ═══════════════════════════════════════════════════════════════
// TODO BACKEND: este archivo completo se activa cuando el back esté listo
// Por ahora no se usa — el page.tsx usa el arreglo estático
// Cuando se conecte al back: importar useIngredients en match/page.tsx
// ═══════════════════════════════════════════════════════════════

// MANTENER: esta función no cambia
// TODO BACKEND: verificar que el endpoint del back sea exactamente:
// GET /api/ingredients/categories/
// Si Django usa otro nombre de endpoint cambiarlo aquí solamente
export async function getCategories(): Promise<ICategory[]> {
  const res = await fetch(`${API_BASE_URL}/ingredients/categories/`, {
    // MANTENER: estos headers no cambian
    headers: {
      "Content-Type": "application/json",
      // TODO BACKEND: si el endpoint requiere autenticación descomentar:
      // "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // MANTENER: este manejo de error no cambia
  if (!res.ok) {
    throw new Error("Error al obtener las categorías de ingredientes");
  }

  return res.json();
}

// MANTENER: esta función no cambia
// TODO BACKEND: verificar que el endpoint del back sea exactamente:
// GET /api/ingredients/categories/:id/
export async function getIngredientsByCategory(categoryId: number): Promise<ICategory> {
  const res = await fetch(`${API_BASE_URL}/ingredients/categories/${categoryId}/`, {
    headers: {
      "Content-Type": "application/json",
      // TODO BACKEND: si el endpoint requiere autenticación descomentar:
      // "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // MANTENER: este manejo de error no cambia
  if (!res.ok) {
    throw new Error(`Error al obtener ingredientes de la categoría ${categoryId}`);
  }

  return res.json();
}
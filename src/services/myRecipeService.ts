// ═══════════════════════════════════════════════════════════════
// TODO BACKEND: descomentar todo este archivo cuando se conecte al back
// Endpoint base: /api/my-recipes/
// Requiere JWT en headers: Authorization: Bearer <token>
// ═══════════════════════════════════════════════════════════════

// import { IMyRecipe, IMyRecipeForm } from "@/types/IMyRecipe";
// import { API_BASE_URL } from "@/constants";

// function authHeaders() {
//   const token = localStorage.getItem("token"); // o donde guardes el JWT
//   return {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
// }

// export const myRecipeService = {

//   // GET /api/my-recipes/
//   async getAll(): Promise<IMyRecipe[]> {
//     const res = await fetch(`${API_BASE_URL}/my-recipes/`, {
//       headers: authHeaders(),
//     });
//     if (!res.ok) throw new Error("Error al obtener las recetas");
//     return res.json();
//   },

//   // POST /api/my-recipes/
//   // Si hay imagen, usar FormData en lugar de JSON
//   async create(form: IMyRecipeForm): Promise<IMyRecipe> {
//     const body = new FormData();
//     body.append("name", form.name);
//     body.append("description", form.description);
//     body.append("difficulty", form.difficulty);
//     body.append("is_alcoholic", String(form.isAlcoholic));
//     body.append("ingredients", JSON.stringify(form.ingredients));
//     body.append("steps", JSON.stringify(form.steps));
//     if (form.tip) body.append("tip", form.tip);
//     if (form.image && form.image.startsWith("data:")) {
//       // Convertir base64 a Blob para enviarlo como archivo
//       const res2 = await fetch(form.image);
//       const blob = await res2.blob();
//       body.append("image", blob, "recipe_image.jpg");
//     }
//
//     const token = localStorage.getItem("token");
//     const res = await fetch(`${API_BASE_URL}/my-recipes/`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` }, // NO poner Content-Type con FormData
//       body,
//     });
//     if (!res.ok) throw new Error("Error al crear la receta");
//     return res.json();
//   },

//   // DELETE /api/my-recipes/{id}/
//   async delete(id: number): Promise<void> {
//     const res = await fetch(`${API_BASE_URL}/my-recipes/${id}/`, {
//       method: "DELETE",
//       headers: authHeaders(),
//     });
//     if (!res.ok) throw new Error("Error al eliminar la receta");
//   },
// };

// ─────────────────────────────────────────────────────────────
// ARCHIVO PREPARADO — no hay código activo aquí todavía
// Descomentar el bloque de arriba cuando se conecte el back
// ─────────────────────────────────────────────────────────────
export {};
// ═══════════════════════════════════════════════════════════════
// Tipo para recetas creadas por el usuario
// TODO BACKEND: este tipo debe coincidir con el modelo Recipe de Django
// Endpoint esperado: GET/POST /api/my-recipes/
// ═══════════════════════════════════════════════════════════════

import { ICocktailIngredient } from "./ICocktail";


export interface IMyRecipe {
  id: number;
  name: string;
  description?: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  isAlcoholic: boolean;
  image: string | null;          // TODO BACKEND: URL desde Django o base64 temporal
  ingredients: ICocktailIngredient[];
  steps: string[];
  tip?: string;
  isFavorite?: boolean;
  createdAt: string;             // ISO date string — vendrá del back
}

// Tipo para el formulario (sin id ni createdAt, que los genera el back)
export interface IMyRecipeForm {
  name: string;
  description: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  isAlcoholic: boolean;
  image: string | null;
  ingredients: ICocktailIngredient[];
  steps: string[];
  tip: string;
}

export const EMPTY_RECIPE_FORM: IMyRecipeForm = {
  name: "",
  description: "",
  difficulty: "Fácil",
  isAlcoholic: true,
  image: null,
  ingredients: [{ name: "", amount: "" }],
  steps: [""],
  tip: "",
};
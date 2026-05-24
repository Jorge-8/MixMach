"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { IMyRecipe, IMyRecipeForm } from "@/types/IMyRecipe";

// ═══════════════════════════════════════════════════════════════
// Context global de mis recetas
// Permite que ProfileCard lea las recetas creadas en /my-recipes
//
// TODO BACKEND: reemplazar el estado local con llamadas reales:
//   - GET  /api/my-recipes/        (al montar, si hay sesión)
//   - POST /api/my-recipes/        (crear)
//   - DELETE /api/my-recipes/{id}/ (eliminar)
// ═══════════════════════════════════════════════════════════════

interface MyRecipesContextType {
  recipes: IMyRecipe[];
  addRecipe: (form: IMyRecipeForm) => IMyRecipe;
  deleteRecipe: (id: number) => void;
}

const MyRecipesContext = createContext<MyRecipesContextType | null>(null);

let NEXT_ID = 1; // TODO BACKEND: eliminar — el id lo genera el back

export function MyRecipesProvider({ children }: { children: ReactNode }) {
  // TODO BACKEND: reemplazar con fetch al endpoint
  const [recipes, setRecipes] = useState<IMyRecipe[]>([]);

  const addRecipe = useCallback((form: IMyRecipeForm): IMyRecipe => {
    const newRecipe: IMyRecipe = {
      ...form,
      id: NEXT_ID++,
      createdAt: new Date().toISOString(),
    };
    setRecipes((prev) => [newRecipe, ...prev]);
    return newRecipe;
  }, []);

  const deleteRecipe = useCallback((id: number) => {
    // TODO BACKEND: await myRecipeService.delete(id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return (
    <MyRecipesContext.Provider value={{ recipes, addRecipe, deleteRecipe }}>
      {children}
    </MyRecipesContext.Provider>
  );
}

export function useMyRecipes() {
  const ctx = useContext(MyRecipesContext);
  if (!ctx)
    throw new Error("useMyRecipes debe usarse dentro de <MyRecipesProvider>");
  return ctx;
}

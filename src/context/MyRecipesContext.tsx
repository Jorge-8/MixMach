"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { IMyRecipe, IMyRecipeForm } from "@/types/IMyRecipe";
import { myRecipeService } from "@/services/myRecipeService";
import { authService } from "@/services/authService";

interface MyRecipesContextType {
  recipes: IMyRecipe[];
  loading: boolean;
  addRecipe: (form: IMyRecipeForm) => Promise<IMyRecipe>;
  deleteRecipe: (id: number) => Promise<void>;
}

const MyRecipesContext = createContext<MyRecipesContextType | null>(null);

export function MyRecipesProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<IMyRecipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function loadRecipes() {
      if (!authService.isAuthenticated()) return;
      setLoading(true);
      myRecipeService
        .getAll()
        .then(setRecipes)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
    loadRecipes();
    window.addEventListener("auth-change", loadRecipes);
    return () => window.removeEventListener("auth-change", loadRecipes);
  }, []);

  const addRecipe = useCallback(async (form: IMyRecipeForm): Promise<IMyRecipe> => {
    try {
      const newRecipe = await myRecipeService.create(form);
      setRecipes((prev) => [newRecipe, ...prev]);
      return newRecipe;
    } catch (err) {
      console.error("addRecipe error:", err);
      throw err;
    }
  }, []);

  const deleteRecipe = useCallback(async (id: number): Promise<void> => {
    try {
      await myRecipeService.delete(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("deleteRecipe error:", err);
      throw err;
    }
  }, []);

  return (
    <MyRecipesContext.Provider value={{ recipes, loading, addRecipe, deleteRecipe }}>
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

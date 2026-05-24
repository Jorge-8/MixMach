"use client";
import { useState, useMemo } from "react";
import { IMyRecipeForm } from "@/types/IMyRecipe";
import { useMyRecipes } from "@/context/MyRecipesContext";
import MyRecipeCard from "@/components/my-recipes/MyRecipeCard";
import MyRecipeModal from "@/components/my-recipes/MyRecipeModal";
import RecipeFormModal from "@/components/my-recipes/RecipeFormModal";

// ═══════════════════════════════════════════════════════════════
// TODO BACKEND: cuando se conecte al back, useMyRecipes usará
// el hook real que llama a GET /api/my-recipes/
// ═══════════════════════════════════════════════════════════════

export default function MyRecipesPage() {
  // MANTENER: viene del contexto compartido con ProfileCard
  const { recipes, addRecipe, deleteRecipe } = useMyRecipes();

  const [selectedRecipe, setSelectedRecipe] = useState<
    import("@/types/IMyRecipe").IMyRecipe | null
  >(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q))
    );
  }, [recipes, search]);

  // TODO BACKEND: reemplazar con: await myRecipeService.create(form);
  function handleSave(form: IMyRecipeForm) {
    addRecipe(form);
    setShowForm(false);
  }

  // TODO BACKEND: reemplazar con: await myRecipeService.delete(id);
  function handleDelete(id: number) {
    deleteRecipe(id);
    if (selectedRecipe?.id === id) setSelectedRecipe(null);
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Estado vacío */}
      {recipes.length === 0 && !showForm && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B6B]/20 to-[#4ECDC4]/20 flex items-center justify-center">
            <i className="bi bi-journal-plus text-4xl text-[#FF6B6B]">{""}</i>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
              Aún no tienes recetas
            </h1>
            <p className="text-sm text-[#9B7A6A] dark:text-[#a89088] max-w-xs">
              Crea tu primer cóctel personalizado y guárdalo aquí.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white font-semibold text-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-lg"
          >
            <i className="bi bi-plus-lg">{""}</i>
            Crear mi primera receta
          </button>
        </div>
      )}

      {/* Vista con recetas */}
      {recipes.length > 0 && (
        <>
          <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-[#EDD9C8] dark:border-[#3a3a5c]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-[#2C1810] dark:text-[#FFF8F0]">
                  Mis Recetas
                </h1>
                <p className="text-xs text-[#9B7A6A] dark:text-[#a89088] mt-0.5">
                  {recipes.length}{" "}
                  {recipes.length === 1 ? "receta creada" : "recetas creadas"}
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white text-sm font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-md"
              >
                <i className="bi bi-plus-lg text-sm">{""}</i>
                Nueva receta
              </button>
            </div>
            <div className="max-w-md mx-auto relative">
              <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#9B7A6A] text-sm">
                {""}
              </i>
              <input
                type="text"
                placeholder="Buscar entre tus recetas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#FFF3EA] dark:bg-[#16213e] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#2C1810] dark:text-[#FFF8F0] placeholder-[#9B7A6A] outline-none focus:border-[#4ECDC4] transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B7A6A] hover:text-[#FF6B6B] transition-colors"
                >
                  <i className="bi bi-x text-sm">{""}</i>
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scroll p-6">
            {filtered.length === 0 && search && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <i className="bi bi-search text-4xl text-[#EDD9C8] dark:text-[#3a3a5c]">
                  {""}
                </i>
                <p className="text-sm font-medium text-[#9B7A6A]">
                  No se encontró{" "}
                  <span className="font-bold text-[#2C1810] dark:text-[#FFF8F0]">
                    &ldquo;{search}&rdquo;
                  </span>
                </p>
                <button
                  onClick={() => setSearch("")}
                  className="text-xs text-[#4ECDC4] hover:underline cursor-pointer"
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}
            {filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((recipe) => (
                  <MyRecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {selectedRecipe && (
        <MyRecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onDelete={handleDelete}
        />
      )}
      {showForm && (
        <RecipeFormModal
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

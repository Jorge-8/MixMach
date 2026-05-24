"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ICocktail } from "@/types/ICocktail";
import { IMyRecipe, IMyRecipeForm } from "@/types/IMyRecipe";
import { useFavorites } from "@/context/FavoritesContext";
import { useMyRecipes } from "@/context/MyRecipesContext";
import CocktailModal from "@/components/match/CocktailModal";
import MyRecipeModal from "@/components/my-recipes/MyRecipeModal";
import RecipeFormModal from "@/components/my-recipes/RecipeFormModal";

// ═══════════════════════════════════════════════════════════════
// TODO BACKEND: eliminar este import cuando se conecte al back
//import { ALL_COCKTAILS } from "@/components/match/CocktailGrid";
// Reemplazar con: const { cocktails } = useFavoriteCocktails() → GET /api/favorites/
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// TODO BACKEND: eliminar MOCK_USER cuando se conecte al back
// Reemplazar con: const { user } = useAuth() → GET /api/auth/me/
// ─────────────────────────────────────────────────────────────
const MOCK_USER = {
  name: "Carla Mendoza",
  email: "carla.mendoza@email.com",
};

// ─────────────────────────────────────────────────────────────
// TODO BACKEND: eliminar MOCK_HISTORY_DATA cuando se conecte al back
// Reemplazar con: const { history, clearHistory } = useSearchHistory()
// Endpoint: GET /api/search-history/ y DELETE /api/search-history/
// Las fechas vienen como ISO string del back y se convierten a Date en el hook
// ─────────────────────────────────────────────────────────────
const MOCK_HISTORY_DATA = [
  { id: 1, query: "Mojito", type: "ingrediente", daysAgo: 1 },
  { id: 2, query: "Margarita", type: "bebida", daysAgo: 2 },
  { id: 3, query: "Piña Colada", type: "bebida", daysAgo: 3 },
  { id: 4, query: "Ron + Limón", type: "ingrediente", daysAgo: 5 },
];

function difficultyColor(d: string) {
  if (d === "Fácil") return "text-green-600 dark:text-green-400";
  if (d === "Medio") return "text-amber-600 dark:text-amber-400";
  return "text-[#FF6B6B]";
}

// MANTENER: calcula iniciales desde el nombre completo que devuelve el back
function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// MANTENER: formatDate — solo se llama en cliente (dentro de mounted check)
function formatDate(daysAgo: number): string {
  if (daysAgo === 0) return "Hoy";
  if (daysAgo === 1) return "Ayer";
  if (daysAgo < 7) return `Hace ${daysAgo} días`;
  const d = new Date(Date.now() - daysAgo * 86400000);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function historyStyle(type: string) {
  if (type === "ingrediente")
    return {
      bg: "bg-[#4ECDC4]/15 dark:bg-[#4ECDC4]/10",
      text: "text-[#4ECDC4]",
      icon: "bi-basket2-fill",
      label: "Ingrediente",
    };
  return {
    bg: "bg-[#FF6B6B]/15 dark:bg-[#FF6B6B]/10",
    text: "text-[#FF6B6B]",
    icon: "bi-cup-straw",
    label: "Bebida",
  };
}

function CocktailThumb({
  cocktail,
  onClick,
}: {
  cocktail: ICocktail;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left"
    >
      {cocktail.image ? (
        <img
          src={cocktail.image}
          alt={cocktail.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-[#FFF3EA] dark:bg-[#0f0f23] flex items-center justify-center">
          <i className="bi bi-cup-straw text-3xl text-[#EDD9C8]">{""}</i>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute top-2 right-2 w-6 h-6 bg-[#FF6B6B] rounded-full flex items-center justify-center shadow">
        <i className="bi bi-heart-fill text-white text-[10px]">{""}</i>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-white text-xs font-semibold leading-tight line-clamp-1">
          {cocktail.name}
        </p>
        <p
          className={`text-[10px] font-medium flex items-center gap-1 mt-0.5 ${difficultyColor(cocktail.difficulty)}`}
        >
          <i className="bi bi-star">{""}</i>
          {cocktail.difficulty}
        </p>
      </div>
    </button>
  );
}

function RecipeThumb({
  recipe,
  onClick,
}: {
  recipe: IMyRecipe;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left"
    >
      {recipe.image ? (
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-[#FFF3EA] dark:bg-[#0f0f23] flex items-center justify-center">
          <i className="bi bi-cup-straw text-3xl text-[#EDD9C8]">{""}</i>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute top-2 left-2">
        <span className="text-[9px] font-bold bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white px-2 py-0.5 rounded-full">
          Mi receta
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-2.5">
        <p className="text-white text-xs font-semibold leading-tight line-clamp-1">
          {recipe.name}
        </p>
        <p
          className={`text-[10px] font-medium flex items-center gap-1 mt-0.5 ${difficultyColor(recipe.difficulty)}`}
        >
          <i className="bi bi-star">{""}</i>
          {recipe.difficulty}
        </p>
      </div>
    </button>
  );
}

function CreateRecipeThumb({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl border-2 border-dashed border-[#EDD9C8] dark:border-[#3a3a5c] flex flex-col items-center justify-center gap-2 text-[#9B7A6A] hover:border-[#FFD93D] hover:text-[#FFD93D] transition-all duration-200 cursor-pointer"
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFD93D]/15 flex items-center justify-center">
        <i className="bi bi-plus-lg text-[#FFD93D] text-base sm:text-lg">
          {""}
        </i>
      </div>
      <span className="text-xs font-medium">Crear receta</span>
    </button>
  );
}

export default function ProfileCard() {
  const router = useRouter();
  const { favoriteIds } = useFavorites();
  const { recipes, addRecipe, deleteRecipe } = useMyRecipes();

  const [selectedCocktail, setSelectedCocktail] = useState<ICocktail | null>(
    null
  );
  const [selectedRecipe, setSelectedRecipe] = useState<IMyRecipe | null>(null);
  const [showRecipeForm, setShowRecipeForm] = useState(false);

  // Evita hydration mismatch — las fechas y toLocaleDateString
  // solo se calculan en cliente
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  // ─────────────────────────────────────────────────────────────
  // TODO BACKEND: reemplazar con useSearchHistory()
  // const { history, clearHistory } = useSearchHistory();
  // ─────────────────────────────────────────────────────────────
  const [history, setHistory] = useState(MOCK_HISTORY_DATA);

  // ─────────────────────────────────────────────────────────────
  // TODO BACKEND: eliminar este useMemo
  // Reemplazar con: const { cocktails } = useFavoriteCocktails()
  // ─────────────────────────────────────────────────────────────
  const favoriteCocktails = useMemo(
    () => ALL_COCKTAILS.filter((c) => favoriteIds.has(c.id)),
    [favoriteIds]
  );

  const userInitials = getInitials(MOCK_USER.name);

  function handleSaveRecipe(form: IMyRecipeForm) {
    // TODO BACKEND: reemplazar con: await myRecipeService.create(form);
    addRecipe(form);
    setShowRecipeForm(false);
  }

  function handleDeleteRecipe(id: number) {
    // TODO BACKEND: reemplazar con: await myRecipeService.delete(id);
    deleteRecipe(id);
    setSelectedRecipe(null);
  }

  function handleLogout() {
    // TODO BACKEND: llamar a POST /api/auth/logout/ y limpiar token JWT
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  }

  function handleClearHistory() {
    // TODO BACKEND: reemplazar con: await searchHistoryService.clear()
    // DELETE /api/search-history/
    setHistory([]);
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scroll">
        <div className="max-w-4xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
          {/* ── Tarjeta de usuario ─────────────────────────────
              TODO BACKEND: datos de GET /api/auth/me/ — MANTENER getInitials
          ────────────────────────────────────────────────────── */}
          <div className="bg-gradient-to-br from-[#FF6B6B]/15 via-[#4ECDC4]/10 to-[#FFD93D]/15 dark:from-[#FF6B6B]/10 dark:via-[#4ECDC4]/8 dark:to-[#FFD93D]/10 border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-3xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#4ECDC4] to-[#FF6B6B] flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-lg sm:text-xl">
                {userInitials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-[#2C1810] dark:text-[#FFF8F0] truncate">
                {MOCK_USER.name}
              </h2>
              <p className="text-xs text-[#9B7A6A] dark:text-[#a89088] truncate">
                {MOCK_USER.email}
              </p>
              <div className="flex gap-3 sm:gap-4 mt-2">
                <div className="text-center">
                  <p className="text-sm sm:text-base font-bold text-[#FF6B6B]">
                    {favoriteCocktails.length}
                  </p>
                  <p className="text-[10px] text-[#9B7A6A]">Favoritos</p>
                </div>
                <div className="w-px bg-[#EDD9C8] dark:bg-[#3a3a5c]" />
                <div className="text-center">
                  <p className="text-sm sm:text-base font-bold text-[#FFD93D]">
                    {recipes.length}
                  </p>
                  <p className="text-[10px] text-[#9B7A6A]">Recetas</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Favoritos — scroll horizontal ─────────────────── */}
          <section className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#2C1810] dark:text-[#FFF8F0] flex items-center gap-2 text-sm sm:text-base">
                <i className="bi bi-heart-fill text-[#FF6B6B]">{""}</i>{" "}
                Favoritos
              </h3>
              {favoriteCocktails.length > 0 && (
                <button
                  onClick={() => router.push("/favorites")}
                  className="text-xs text-[#4ECDC4] hover:underline cursor-pointer"
                >
                  Ver todos
                </button>
              )}
            </div>
            {favoriteCocktails.length === 0 ? (
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#FFF3EA] dark:bg-[#16213e] border border-dashed border-[#EDD9C8] dark:border-[#3a3a5c] rounded-2xl">
                <i className="bi bi-heart text-[#FF6B6B] text-lg">{""}</i>
                <p className="text-xs text-[#9B7A6A]">
                  Aún no tienes favoritos. Presiona el corazón en cualquier
                  cóctel.
                </p>
              </div>
            ) : (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto custom-scroll pb-2">
                {favoriteCocktails.map((cocktail) => (
                  <CocktailThumb
                    key={cocktail.id}
                    cocktail={cocktail}
                    onClick={() => setSelectedCocktail(cocktail)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── Mis Recetas — scroll horizontal ──────────────── */}
          <section className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#2C1810] dark:text-[#FFF8F0] flex items-center gap-2 text-sm sm:text-base">
                <i className="bi bi-journal-text text-[#FFD93D]">{""}</i> Mis
                Recetas
              </h3>
              {recipes.length > 0 && (
                <button
                  onClick={() => router.push("/my-recipes")}
                  className="text-xs text-[#4ECDC4] hover:underline cursor-pointer"
                >
                  Ver todas
                </button>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto custom-scroll pb-2">
              {recipes.map((recipe) => (
                <RecipeThumb
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                />
              ))}
              <CreateRecipeThumb onClick={() => setShowRecipeForm(true)} />
            </div>
          </section>

          {/* ── Historial ─────────────────────────────────────────
              TODO BACKEND: GET /api/search-history/
              Al conectar: reemplazar history y handleClearHistory
              con useSearchHistory() hook
          ──────────────────────────────────────────────────────── */}
          <section className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#2C1810] dark:text-[#FFF8F0] flex items-center gap-2 text-sm sm:text-base">
                <i className="bi bi-clock-history text-[#4ECDC4]">{""}</i>{" "}
                Historial de búsqueda
              </h3>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-[#FF6B6B] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <i className="bi bi-trash text-xs">{""}</i> Limpiar
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {history.length === 0 ? (
                <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#FFF3EA] dark:bg-[#16213e] border border-dashed border-[#EDD9C8] dark:border-[#3a3a5c] rounded-2xl">
                  <i className="bi bi-clock-history text-[#4ECDC4] text-lg">
                    {""}
                  </i>
                  <p className="text-xs text-[#9B7A6A]">
                    No hay búsquedas recientes.
                  </p>
                </div>
              ) : (
                history.map((item) => {
                  const style = historyStyle(item.type);
                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        router.push(`/?q=${encodeURIComponent(item.query)}`)
                      }
                      className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white dark:bg-[#16213e] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-2xl hover:border-[#4ECDC4] hover:shadow-sm transition-all duration-200 cursor-pointer group text-left"
                    >
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${style.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <i className={`bi ${style.icon} ${style.text} text-sm`}>
                          {""}
                        </i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-[#2C1810] dark:text-[#FFF8F0] truncate group-hover:text-[#4ECDC4] transition-colors">
                          {item.query}
                        </p>
                        <p className={`text-[10px] font-medium ${style.text}`}>
                          {style.label}
                        </p>
                      </div>
                      {/* Fecha solo en cliente para evitar hydration mismatch */}
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <span className="text-[10px] text-[#9B7A6A] dark:text-[#a89088] bg-[#FFF3EA] dark:bg-[#0f0f23] px-2 py-0.5 rounded-full">
                          {mounted ? formatDate(item.daysAgo) : ""}
                        </span>
                        <i className="bi bi-arrow-up-left text-[#9B7A6A] text-xs group-hover:text-[#4ECDC4] transition-colors">
                          {""}
                        </i>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </section>

          {/* ── Cerrar sesión ── */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-2xl border-2 border-[#EDD9C8] dark:border-[#3a3a5c] text-sm font-medium text-[#9B7A6A] hover:border-[#FF6B6B] hover:text-[#FF6B6B] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <i className="bi bi-box-arrow-right">{""}</i>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* ── Modales ── */}
      {selectedCocktail && (
        <CocktailModal
          cocktail={selectedCocktail}
          mode="browse"
          onClose={() => setSelectedCocktail(null)}
        />
      )}
      {selectedRecipe && (
        <MyRecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onDelete={handleDeleteRecipe}
        />
      )}
      {showRecipeForm && (
        <RecipeFormModal
          onClose={() => setShowRecipeForm(false)}
          onSave={(form) => {
            handleSaveRecipe(form);
            router.push("/my-recipes");
          }}
        />
      )}
    </div>
  );
}

"use client";
import { useState, useMemo } from "react";
import { ICocktail } from "@/types/ICocktail";
import { useFavorites } from "@/context/FavoritesContext";
import FavoriteCard from "@/components/favorites/FavoriteCard";
import CocktailModal from "@/components/match/CocktailModal";

// ═══════════════════════════════════════════════════════════════
// TODO BACKEND: eliminar este import cuando se conecte al back
// Reemplazar con: const { favorites, loading } = useFavoritesData();
// Endpoint: GET /api/favorites/ → devuelve ICocktail[] del usuario
// ═══════════════════════════════════════════════════════════════
import { ALL_COCKTAILS } from "@/components/match/CocktailGrid";
// FIN bloque a eliminar
// ═══════════════════════════════════════════════════════════════

export default function FavoritesPage() {
  // MANTENER: favoriteIds viene del context global
  // TODO BACKEND: cuando se conecte, el context ya tendrá los ids del servidor
  const { favoriteIds } = useFavorites();

  const [selected, setSelected] = useState<ICocktail | null>(null);
  const [search, setSearch] = useState("");

  // ─────────────────────────────────────────────────────────────
  // TODO BACKEND: eliminar este useMemo — el back devuelve solo los favoritos
  // Reemplazar con: const favorites = useFavoritesData() que llama al endpoint
  // ─────────────────────────────────────────────────────────────
  const favorites = useMemo(
    () => ALL_COCKTAILS.filter((c) => favoriteIds.has(c.id)),
    [favoriteIds]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.ingredients.some((i) => i.name.toLowerCase().includes(q))
    );
  }, [favorites, search]);

  // Modo vacío: sin favoritos aún
  const noFavorites = favorites.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* ── Sin favoritos ── */}
      {noFavorites && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B6B]/20 to-[#FFD93D]/20 flex items-center justify-center">
            <i className="bi bi-heart text-4xl text-[#FF6B6B]">{""}</i>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
              Aún no tienes favoritos
            </h1>
            <p className="text-sm text-[#9B7A6A] dark:text-[#a89088] max-w-xs">
              Presiona el corazón en cualquier cóctel para guardarlo aquí y
              tenerlo siempre a la mano.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#FFF3EA] dark:bg-[#16213e] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-2xl px-5 py-3">
            <i className="bi bi-heart-fill text-[#FF6B6B]">{""}</i>
            <p className="text-xs text-[#9B7A6A]">
              Encuéntralos en{" "}
              <span className="font-semibold text-[#2C1810] dark:text-[#FFF8F0]">
                Inicio
              </span>{" "}
              o{" "}
              <span className="font-semibold text-[#2C1810] dark:text-[#FFF8F0]">
                Buscar
              </span>
            </p>
          </div>
        </div>
      )}

      {/* ── Con favoritos ── */}
      {!noFavorites && (
        <>
          {/* Header */}
          <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-[#EDD9C8] dark:border-[#3a3a5c]">
            <div className="flex items-center gap-2 mb-1">
              <i className="bi bi-heart-fill text-[#FF6B6B] text-lg">{""}</i>
              <h1 className="text-xl font-bold text-[#2C1810] dark:text-[#FFF8F0]">
                Mis Favoritos
              </h1>
            </div>
            <p className="text-xs text-[#9B7A6A] dark:text-[#a89088] mb-4">
              {favorites.length}{" "}
              {favorites.length === 1
                ? "cóctel guardado"
                : "cócteles guardados"}
            </p>

            {/* Buscador centrado */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#9B7A6A] text-sm">
                  {""}
                </i>
                <input
                  type="text"
                  placeholder="Buscar en tus favoritos..."
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
          </div>

          {/* Grid */}
          <div className="flex-1 overflow-y-auto custom-scroll px-6 p-6">
            {/* Sin resultados de búsqueda */}
            {filtered.length === 0 && search && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <i className="bi bi-search text-4xl text-[#EDD9C8] dark:text-[#3a3a5c]">
                  {""}
                </i>
                <p className="text-sm font-medium text-[#9B7A6A]">
                  No se encontró &ldquo;{search}&rdquo; en tus favoritos
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
                {filtered.map((cocktail) => (
                  <FavoriteCard
                    key={cocktail.id}
                    cocktail={cocktail}
                    onClick={() => setSelected(cocktail)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de detalle — modo browse: todos los ingredientes con palomita */}
      {selected && (
        <CocktailModal
          cocktail={selected}
          mode="browse"
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

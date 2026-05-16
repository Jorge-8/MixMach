"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// ═══════════════════════════════════════════════════════════════
// Context global de favoritos
// Por ahora persiste en memoria (se pierde al recargar)
//
// TODO BACKEND: reemplazar el estado local con llamadas reales:
//   - initFavorites → GET /api/favorites/         (al montar, si hay sesión)
//   - addFavorite   → POST /api/favorites/         body: { cocktail_id }
//   - removeFavorite→ DELETE /api/favorites/{id}/
// Requiere JWT en headers. Descomentar useFavoritesBackend() abajo.
// ═══════════════════════════════════════════════════════════════

interface FavoritesContextType {
  favoriteIds: Set<number>;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // ─────────────────────────────────────────────────────────────
  // TODO BACKEND: eliminar este useState y reemplazar con:
  // const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  // useEffect(() => { fetchFavorites().then(ids => setFavoriteIds(new Set(ids))); }, []);
  // ─────────────────────────────────────────────────────────────
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const isFavorite = useCallback(
    (id: number) => favoriteIds.has(id),
    [favoriteIds]
  );

  const toggleFavorite = useCallback((id: number) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // TODO BACKEND: await favoriteService.remove(id);
      } else {
        next.add(id);
        // TODO BACKEND: await favoriteService.add(id);
      }
      return next;
    });
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook para consumir el context — usar en cualquier componente
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  return ctx;
}

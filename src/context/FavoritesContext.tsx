"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { ICocktail } from "@/types/ICocktail";
import { favoriteService } from "@/services/favoriteService";
import { authService } from "@/services/authService";

interface FavoritesContextType {
  favoriteCocktails: ICocktail[];
  favoriteIds: Set<number>;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => Promise<void>;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteCocktails, setFavoriteCocktails] = useState<ICocktail[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function loadFavorites() {
      if (!authService.isAuthenticated()) return;
      setLoading(true);
      favoriteService
        .getAll()
        .then(setFavoriteCocktails)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
    loadFavorites();
    window.addEventListener("auth-change", loadFavorites);
    return () => window.removeEventListener("auth-change", loadFavorites);
  }, []);

  const favoriteIds = useMemo(
    () => new Set(favoriteCocktails.map((c) => c.id)),
    [favoriteCocktails]
  );

  const isFavorite = useCallback(
    (id: number) => favoriteIds.has(id),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (id: number) => {
      if (!authService.isAuthenticated()) {
        console.warn("toggleFavorite: usuario no autenticado");
        return;
      }
      try {
        if (favoriteIds.has(id)) {
          await favoriteService.remove(id);
          setFavoriteCocktails((prev) => prev.filter((c) => c.id !== id));
        } else {
          const cocktail = await favoriteService.add(id);
          setFavoriteCocktails((prev) => [...prev, cocktail]);
        }
      } catch (err) {
        console.error("toggleFavorite error:", err);
      }
    },
    [favoriteIds]
  );

  return (
    <FavoritesContext.Provider
      value={{ favoriteCocktails, favoriteIds, isFavorite, toggleFavorite, loading }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx)
    throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  return ctx;
}

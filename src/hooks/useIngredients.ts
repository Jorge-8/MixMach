import { useState, useEffect } from "react";
import { getCategories } from "@/services/ingredientService";
import { ICategory } from "@/types/ICategory";

// ═══════════════════════════════════════════════════════════════
// TODO BACKEND: este hook se activa cuando el back esté listo
// Por ahora no se usa — el page.tsx usa el arreglo estático
// Cuando se conecte al back descomentar en match/page.tsx:
// import { useIngredients } from "@/hooks/useIngredients";
// const { categories, loading, error } = useIngredients();
// ═══════════════════════════════════════════════════════════════

export function useIngredients() {
  // MANTENER: estos estados no cambian
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);

  // MANTENER: este useEffect no cambia
  useEffect(() => {
    async function fetchCategories() {
      try {
        // MANTENER: esta lógica no cambia
        setLoading(true);
        setError(null);
        const data = await getCategories(); // ← llama al service
        setCategories(data);
      } catch (err) {
        // MANTENER: este manejo de error no cambia
        setError("No se pudieron cargar los ingredientes");
        console.error(err);
      } finally {
        // MANTENER: esto no cambia
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // MANTENER: este return no cambia
  // loading → true mientras carga, false cuando termina
  // error   → null si todo bien, mensaje si algo falló
  // categories → arreglo vacío al inicio, lleno cuando carga
  return { categories, loading, error };
}
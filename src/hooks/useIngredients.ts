import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/constants";
import { normalizeText } from "@/utils/normalize";

// Devuelve optionalPool: lista de nombres (strings) que NO están en los predefinidos
export function useIngredients() {
  const [optionalPool, setOptionalPool] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/ingredients/`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Error al obtener ingredientes desde el back");
        const data: { id:number; name:string; category:string | null }[] = await res.json();

        // normaliza y deduplica nombres
        const uniqueNames = Array.from(
          new Map(data.map((d) => [normalizeText(d.name), d.name])).values()
        );

        setOptionalPool(uniqueNames);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los ingredientes");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return { optionalPool, loading, error };
}
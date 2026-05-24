"use client";
import { useState } from "react";
import CocktailCard from "./CocktailCard";
import CocktailModal from "./CocktailModal";
import { ICocktail } from "@/types/ICocktail";
import { ingredientMatches } from "@/utils/normalize";

// ═══════════════════════════════════════════════════════════════
// TODO BACKEND: eliminar este bloque cuando se conecte al back
// Reemplazar con: const { cocktails, loading, error } = useCocktails(selectedIngredients);
// ═══════════════════════════════════════════════════════════════
export const ALL_COCKTAILS: ICocktail[] = [
  {
    id: 1,
    name: "Mojito Clásico",
    description:
      "El refrescante clásico cubano. Hierbabuena fresca, ron y lima en perfecta armonía.",
    difficulty: "Fácil",
    isAlcoholic: true,
    image:
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=250&fit=crop",
    ingredients: [
      { name: "Ron blanco", amount: "60 ml" },
      { name: "Hierbabuena", amount: "10 hojas" },
      { name: "Lima", amount: "1 unidad" },
      { name: "Azúcar", amount: "2 cdas" },
      { name: "Soda", amount: "120 ml" },
      { name: "Hielo", amount: "al gusto" },
    ],
    steps: [
      "Coloca las hojas de hierbabuena y el azúcar en un vaso alto.",
      "Exprime el jugo de media lima y agrégalo al vaso.",
      "Machaca suavemente con un mortero para liberar los aceites de la hierbabuena.",
      "Llena el vaso con hielo picado.",
      "Vierte el ron blanco y mezcla con una cuchara larga.",
      "Completa con soda y revuelve suavemente. ¡Sirve y disfruta!",
    ],
    tip: "Sirve frío y disfruta con buena compañía. ¡Salud!",
    isFavorite: false,
  },
  {
    id: 2,
    name: "Margarita",
    description:
      "El cóctel mexicano por excelencia. Perfecto equilibrio entre el tequila, el limón y la sal.",
    difficulty: "Fácil",
    isAlcoholic: true,
    image:
      "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&h=250&fit=crop",
    ingredients: [
      { name: "Tequila", amount: "60 ml" },
      { name: "Triple sec", amount: "30 ml" },
      { name: "Jugo de limón", amount: "30 ml" },
      { name: "Sal", amount: "al gusto" },
      { name: "Hielo", amount: "al gusto" },
    ],
    steps: [
      "Escarca el borde de la copa con sal.",
      "Agrega hielo al shaker.",
      "Vierte el tequila, triple sec y jugo de limón.",
      "Agita vigorosamente por 15 segundos.",
      "Cuela y sirve en la copa escarchada.",
    ],
    tip: "Puedes sustituir el triple sec por Cointreau para un sabor más refinado.",
    isFavorite: false,
  },
  {
    id: 3,
    name: "Piña Colada",
    description:
      "El sabor del trópico en cada sorbo. Ron, coco y piña en perfecta combinación.",
    difficulty: "Fácil",
    isAlcoholic: true,
    image:
      "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=250&fit=crop",
    ingredients: [
      { name: "Ron blanco", amount: "60 ml" },
      { name: "Jugo de piña", amount: "120 ml" },
      { name: "Hielo", amount: "al gusto" },
    ],
    steps: [
      "Coloca todos los ingredientes en la licuadora.",
      "Licua hasta obtener una mezcla suave.",
      "Sirve en vaso alto decorado con una rodaja de piña.",
    ],
    isFavorite: false,
  },
  {
    id: 4,
    name: "Daiquirí de Fresa",
    description:
      "Versión frutal del clásico daiquirí. Fresco, dulce y ligeramente ácido.",
    difficulty: "Fácil",
    isAlcoholic: true,
    image:
      "https://images.unsplash.com/photo-1560963689-b5682b6440f8?w=400&h=250&fit=crop",
    ingredients: [
      { name: "Ron blanco", amount: "60 ml" },
      { name: "Jugo de limón", amount: "30 ml" },
      { name: "Jarabe simple", amount: "20 ml" },
      { name: "Hielo", amount: "al gusto" },
    ],
    steps: [
      "Agrega todos los ingredientes al shaker con hielo.",
      "Agita vigorosamente por 20 segundos.",
      "Cuela y sirve en copa fría.",
    ],
    isFavorite: false,
  },
  {
    id: 5,
    name: "Moscow Mule",
    description:
      "Cóctel refrescante con vodka y ginger beer. Perfecto para el calor.",
    difficulty: "Fácil",
    isAlcoholic: true,
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=250&fit=crop",
    ingredients: [
      { name: "Vodka", amount: "60 ml" },
      { name: "Jugo de limón", amount: "30 ml" },
      { name: "Soda", amount: "120 ml" },
      { name: "Hielo", amount: "al gusto" },
      { name: "Hierbabuena", amount: "al gusto" },
    ],
    steps: [
      "Llena una taza de cobre (o vaso) con hielo.",
      "Agrega el vodka y el jugo de limón.",
      "Completa con ginger beer y revuelve suavemente.",
      "Decora con rodaja de limón y hojas de menta.",
    ],
    isFavorite: false,
  },
  {
    id: 6,
    name: "Cosmopolitan",
    description:
      "El cóctel favorito de Sex and the City. Elegante, rosa y delicioso.",
    difficulty: "Medio",
    isAlcoholic: true,
    image:
      //   "https://images.unsplash.com/photo-1599225745889-4f93ca1fb0ab?w=400&h=250&fit=crop",
      "",
    ingredients: [
      { name: "Vodka", amount: "45 ml" },
      { name: "Triple sec", amount: "15 ml" },
      { name: "Jugo de limón", amount: "15 ml" },
      { name: "Jugo de arándano", amount: "30 ml" },
      { name: "Hielo", amount: "al gusto" },
    ],
    steps: [
      "Enfría una copa martini en el congelador.",
      "Agrega todos los ingredientes al shaker con hielo.",
      "Agita vigorosamente por 15 segundos.",
      "Cuela en la copa fría.",
      "Decora con un twist de limón.",
    ],
    isFavorite: false,
  },
  {
    id: 7,
    name: "Gin Tonic",
    description:
      "La combinación más clásica y refrescante. Simple, elegante y perfecto.",
    difficulty: "Fácil",
    isAlcoholic: true,
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
    ingredients: [
      { name: "Ginebra", amount: "60 ml" },
      { name: "Agua tónica", amount: "150 ml" },
      { name: "Jugo de limón", amount: "al gusto" },
      { name: "Hielo", amount: "al gusto" },
    ],
    steps: [
      "Llena una copa grande con hielo.",
      "Agrega la ginebra.",
      "Completa con agua tónica fría.",
      "Exprime un poco de limón y mezcla suavemente.",
      "Decora con una rodaja de limón.",
    ],
    isFavorite: false,
  },
  {
    id: 8,
    name: "Virgin Mojito",
    description: "Todo el sabor del mojito sin alcohol. Perfecto para todos.",
    difficulty: "Fácil",
    isAlcoholic: false,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=250&fit=crop",
    ingredients: [
      { name: "Hierbabuena", amount: "10 hojas" },
      { name: "Jugo de limón", amount: "30 ml" },
      { name: "Azúcar", amount: "2 cdas" },
      { name: "Soda", amount: "200 ml" },
      { name: "Hielo", amount: "al gusto" },
    ],
    steps: [
      "Coloca la hierbabuena y el azúcar en un vaso.",
      "Agrega el jugo de limón y machaca suavemente.",
      "Llena con hielo picado.",
      "Completa con soda y mezcla.",
    ],
    tip: "Añade un poco de agua de coco para un toque tropical.",
    isFavorite: false,
  },
];
// ═══════════════════════════════════════════════════════════════
// FIN bloque a eliminar cuando se conecte al back
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// TODO BACKEND: descomentar cuando se conecte al back
// import { useCocktails } from "@/hooks/useCocktails";
// ═══════════════════════════════════════════════════════════════

interface Props {
  selectedIngredients: string[];
}

// MANTENER: función de match — no cambia con el back
// calcula cuántos ingredientes de la receta tiene el usuario
function getMatch(cocktail: ICocktail, selected: string[]) {
  if (selected.length === 0) {
    return {
      matched: 0,
      total: cocktail.ingredients.length,
      pct: 0,
    };
  }

  const matched = cocktail.ingredients.filter((ing) =>
    selected.some((s) => ingredientMatches(s, ing.name))
  ).length;

  const total = cocktail.ingredients.length;

  const pct = Math.round((matched / total) * 100);

  return {
    matched,
    total,
    pct,
  };
}

export default function CocktailGrid({ selectedIngredients }: Props) {
  const [selected, setSelected] = useState<ICocktail | null>(null);

  // ─────────────────────────────────────────────────────────────
  // TODO BACKEND: descomentar cuando se conecte al back
  // const { cocktails, loading, error } = useCocktails(selectedIngredients);
  // if (loading) return <p className="p-8 text-[#9B7A6A]">Buscando cócteles...</p>;
  // if (error)   return <p className="p-8 text-red-400">{error}</p>;
  // ─────────────────────────────────────────────────────────────

  // ─────────────────────────────────────────────────────────────
  // TODO BACKEND: BORRAR este bloque — el filtrado lo hace el back
  // El back recibe los ids de ingredientes y devuelve los cócteles ordenados
  // ─────────────────────────────────────────────────────────────
  const cocktails =
    selectedIngredients.length === 0
      ? ALL_COCKTAILS
      : ALL_COCKTAILS.map((c) => ({
          ...c,
          _match: getMatch(c, selectedIngredients),
        }))
          .filter((c) => c._match.matched > 0)
          .sort((a, b) => b._match.pct - a._match.pct);
  // ─────────────────────────────────────────────────────────────

  // MANTENER: estado vacío cuando no hay ingredientes seleccionados
  if (selectedIngredients.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
        <span className="text-6xl">🍹</span>
        <h1 className="text-2xl font-bold text-[#2C1810] bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
          ¿Qué tienes hoy?
        </h1>
        <p className="text-sm text-[#9B7A6A] dark:text-[#a89088]">
          Selecciona tus ingredientes y encontramos el cóctel perfecto
        </p>
      </div>
    );
  }

  // MANTENER: estado vacío cuando no hay coincidencias
  if (cocktails.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
        <span className="text-5xl bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
          <i className="bi bi-bug"></i>
        </span>
        <h2 className="text-xl font-bold text-[#2C1810] bg-gradient-to-r from-[#FF6B6B] via-[#4ECDC4] to-[#FFD93D] bg-clip-text text-transparent">
          Sin resultados
        </h2>
        <p className="text-sm text-[#9B7A6A] dark:text-[#a89088]">
          No encontramos cócteles con esos ingredientes. Intenta agregar más.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scroll p-6">
      {/* Header resultados — MANTENER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#2C1810] dark:text-[#FFF8F0]">
            Cócteles recomendados
          </h2>
          <p className="text-xs text-[#9B7A6A] dark:text-[#a89088] mt-0.5">
            {cocktails.length} recetas coinciden · ordenadas por compatibilidad
          </p>
        </div>

        {/* Leyenda — MANTENER */}
        <div className="flex items-center gap-3 text-xs text-[#9B7A6A]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            100%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            ≥70%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6B6B] inline-block" />
            ≥40%
          </span>
        </div>
      </div>

      {/* Grid — MANTENER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cocktails.map((cocktail) => {
          // TODO BACKEND: BORRAR esta línea — el match vendrá calculado del back
          const match = getMatch(cocktail, selectedIngredients);
          return (
            <CocktailCard
              key={cocktail.id}
              cocktail={cocktail}
              match={match}
              onClick={() => setSelected(cocktail)}
            />
          );
        })}
      </div>

      {/* Modal — MANTENER */}
      {selected && (
        <CocktailModal
          cocktail={selected}
          match={getMatch(selected, selectedIngredients)}
          selectedIngredients={selectedIngredients}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

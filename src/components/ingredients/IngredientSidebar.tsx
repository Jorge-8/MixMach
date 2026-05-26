"use client";
import { useState, useEffect, useMemo } from "react";
import { normalizeText } from "@/utils/normalize";
import { API_BASE_URL } from "@/constants";


const CATEGORY_META: Record<string, any> = {
  "Licores": {
    id: "licores",
    emoji: "🍺",
    name: "Licores",
    color: {
      headerBg: "bg-amber-100 border-b-2 border-amber-200 dark:bg-amber-950/30",
      border: "border-2 border-amber-200 dark:border-amber-800",
      header: "text-amber-700 dark:text-amber-400",
      badge: "bg-amber-500",
      item: "bg-white dark:bg-amber-900/40 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:border-amber-500 hover:text-amber-600",
      itemActive: "bg-amber-500 border-amber-500 text-white",
      itemHighlight:
        "border-amber-500 ring-2 ring-amber-300 dark:ring-amber-600 bg-amber-50 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300",
      more: "bg-[#FFF1B9] text-amber-500 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/40",
    },
  },
  "Jugos y néctares": {
    id: "jugos",
    emoji: "🍊",
    name: "Jugos y néctares",
    color: {
      headerBg: "bg-orange-100 border-b-2 border-orange-200 dark:bg-orange-950/30",
      border: "border-2 border-orange-200 dark:border-orange-800",
      header: "text-orange-700 dark:text-orange-400",
      badge: "bg-orange-500",
      item: "bg-white dark:bg-orange-900/40 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-300 hover:border-orange-500 hover:text-orange-600",
      itemActive: "bg-orange-500 border-orange-500 text-white",
      itemHighlight:
        "border-orange-500 ring-2 ring-orange-300 dark:ring-orange-600 bg-orange-50 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300",
      more: "bg-orange-50 text-orange-500 border-orange-300 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/40",
    },
  },
  "Frescos y hierbas": {
    id: "frescos",
    emoji: "🌿",
    name: "Frescos y hierbas",
    color: {
      headerBg: "bg-green-50 border-b-2 border-green-200 dark:bg-green-950/30",
      border: "border-2 border-green-200 dark:border-green-800",
      header: "text-green-700 dark:text-green-400",
      badge: "bg-green-500",
      item: "bg-white dark:bg-green-900/40 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300 hover:border-green-500 hover:text-green-600",
      itemActive: "bg-green-500 border-green-500 text-white",
      itemHighlight:
        "border-green-500 ring-2 ring-green-300 dark:ring-green-600 bg-green-50 dark:bg-green-900/60 text-green-700 dark:text-green-300",
      more: "bg-green-50 text-green-500 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/40",
    },
  },
  "Dulces y jarabes": {
    id: "dulces",
    emoji: "🍬",
    name: "Dulces y jarabes",
    color: {
      headerBg: "bg-pink-50 border-b-2 border-pink-200 dark:bg-pink-950/30",
      border: "border-2 border-pink-200 dark:border-pink-800",
      header: "text-pink-700 dark:text-pink-400",
      badge: "bg-pink-500",
      item: "bg-white dark:bg-pink-900/40 border-pink-200 dark:border-pink-700 text-pink-800 dark:text-pink-300 hover:border-pink-500 hover:text-pink-600",
      itemActive: "bg-pink-500 border-pink-500 text-white",
      itemHighlight:
        "border-pink-500 ring-2 ring-pink-300 dark:ring-pink-600 bg-pink-50 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300",
      more: "bg-pink-50 text-pink-500 border-pink-300 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/40",
    },
  },
  "Gaseosas y mixers": {
    id: "gaseosas",
    emoji: "🫧",
    name: "Gaseosas y mixers",
    color: {
      headerBg: "bg-blue-50 border-b-2 border-blue-200 dark:bg-blue-950/30",
      border: "border-2 border-blue-200 dark:border-blue-800",
      header: "text-blue-700 dark:text-blue-400",
      badge: "bg-blue-500",
      item: "bg-white dark:bg-blue-900/40 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300 hover:border-blue-500 hover:text-blue-600",
      itemActive: "bg-blue-500 border-blue-500 text-white",
      itemHighlight:
        "border-blue-500 ring-2 ring-blue-300 dark:ring-blue-600 bg-blue-50 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300",
      more: "bg-blue-50 text-blue-500 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/40",
    },
  },
  "Extras": {
    id: "extras",
    emoji: "🧊",
    name: "Extras",
    color: {
      headerBg: "bg-purple-50 border-b-2 border-purple-200 dark:bg-purple-950/30",
      border: "border-2 border-purple-200 dark:border-purple-800",
      header: "text-purple-700 dark:text-purple-400",
      badge: "bg-purple-500",
      item: "bg-white dark:bg-purple-900/40 border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-300 hover:border-purple-500 hover:text-purple-600",
      itemActive: "bg-purple-500 border-purple-500 text-white",
      itemHighlight:
        "border-purple-500 ring-2 ring-purple-300 dark:ring-purple-600 bg-purple-50 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300",
      more: "bg-purple-50 text-purple-500 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/40",
    },
  },
};

const PREDEFINED_ORDER = [
  "Licores",
  "Jugos y néctares",
  "Frescos y hierbas",
  "Dulces y jarabes",
  "Gaseosas y mixers",
  "Extras",
];

const VISIBLE_COUNT = 8;

interface Props {
  showFilters?: boolean;
  onSearch?: (selected: string[]) => void;
  onChange?: (selected: string[]) => void;
}

export default function IngredientSidebar({
  showFilters = true,
  onChange,
}: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // Estados para categorias traídas del back
  const [categories, setCategories] = useState<any[]>([]);
  const [optionalPool, setOptionalPool] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onChange?.(selected);
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch ingredientes del back y agrupar por categoría
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/ingredients/`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Error al cargar ingredientes desde el servidor");
        const data: { id:number; name:string; category:string | null }[] = await res.json();

        // Agrupar por category
        const map = new Map<string, string[]>();
        for (const it of data) {
          const catName = it.category?.trim() || "Sin categoría";
          if (!map.has(catName)) map.set(catName, []);
          map.get(catName)!.push(it.name);
        }

        // Construir array de categorías en el orden predefinido
        const built: any[] = PREDEFINED_ORDER.map((catName) => {
          const meta = CATEGORY_META[catName]!;
          
          //const items = (map.get(catName) || []).sort((a,b)=>a.localeCompare(b,'es'));

          const items = (map.get(catName) || []).sort((a,b) =>
            a.localeCompare(b, 'es', { sensitivity: 'base', ignorePunctuation: true })
          );
          
          return { id: meta.id, emoji: meta.emoji, name: meta.name, color: meta.color, items };
        });

        // Opcionales: ingredientes cuyo category no está en PREDEFINED_ORDER
        const extraItems: string[] = [];
        for (const [catName, names] of map.entries()) {
          if (!PREDEFINED_ORDER.includes(catName)) {
            extraItems.push(...names);
          }
        }

        setCategories(built);
        // pool opcional: únicos, normalizados y ordenados
        const pool = Array.from(new Map(extraItems.map(n => [normalizeText(n), n])).values());
        setOptionalPool(pool);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los ingredientes");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const qNorm = useMemo(() => normalizeText(search.trim()), [search]);
  const isSearching = search.trim().length > 0;

  const { matchingCats, dimmedCats } = useMemo(() => {
    if (!isSearching) {
      return { matchingCats: categories, dimmedCats: [] };
    }
    const matching: typeof categories = [];
    const dimmed: typeof categories = [];
    for (const cat of categories) {
      cat.items.some((i: string) => normalizeText(i).includes(qNorm))
        ? matching.push(cat)
        : dimmed.push(cat);
    }
    return { matchingCats: matching, dimmedCats: dimmed };
  }, [isSearching, qNorm, categories]);

  const optionalMatches = useMemo<string[]>(() => {
    if (!isSearching) return [];
    return optionalPool.filter((n) => normalizeText(n).includes(qNorm));
  }, [isSearching, qNorm, optionalPool]);

  const nothingFound =
    isSearching && matchingCats.length === 0 && optionalMatches.length === 0;

  function toggleIngredient(item: string) {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }
  function toggleCollapse(id: string) {
    setCollapsed((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }
  function toggleExpand(id: string) {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }
  function clearAll() {
    setSelected([]);
  }

  function shortIngredient(name: string) {
    return name;
  }

  function renderCategory(
    cat: (typeof categories)[number],
    dimmed = false
  ) {
    const isCollapsed = collapsed.includes(cat.id);
    const isExpanded = expanded.includes(cat.id);
    const selectedItems = cat.items.filter((i: string) => selected.includes(i));
    const nonSelected = cat.items.filter((i: string) => !selected.includes(i));

    let ordered: string[];
    if (isSearching && !dimmed) {
      const hits = nonSelected.filter((i: string) => normalizeText(i).includes(qNorm));
      const rest = nonSelected.filter((i: string) => !normalizeText(i).includes(qNorm));
      ordered = [...selectedItems, ...hits, ...rest];
    } else {
      ordered = [...selectedItems, ...nonSelected];
    }

    const visible = isExpanded ? ordered : ordered.slice(0, VISIBLE_COUNT);
    const hiddenCount = ordered.length - VISIBLE_COUNT;

    return (
      <div
        key={cat.id}
        className={`mx-3 my-2 rounded-2xl overflow-hidden border ${cat.color.border} transition-all duration-300 ${dimmed ? "opacity-35 pointer-events-none select-none" : ""}`}
      >
        <button
          onClick={() => toggleCollapse(cat.id)}
          className={`w-full flex items-center justify-between px-4 py-3 transition-colors cursor-pointer ${cat.color.headerBg}`}
        >
          <div className="flex items-center gap-2">
            <span>{cat.emoji}</span>
            <span className={`text-sm font-bold ${cat.color.header}`}>
              {cat.name}
            </span>
            {selectedItems.length > 0 && (
              <span
                className={`w-5 h-5 ${cat.color.badge} text-white text-[10px] font-bold rounded-full flex items-center justify-center`}
              >
                {selectedItems.length}
              </span>
            )}
          </div>
          <i
            className={`bi bi-chevron-${isCollapsed ? "down" : "up"} text-xs ${cat.color.header}`}
          >
            {""}
          </i>
        </button>

        {!isCollapsed && (
          <div className="px-3 pb-3 pt-2 flex flex-wrap gap-2">
            {visible.map((item: string) => {
              const isSel = selected.includes(item);
              const isHit =
                isSearching && !dimmed && normalizeText(item).includes(qNorm);
              const cls = isSel
                ? cat.color.itemActive
                : isHit
                  ? cat.color.itemHighlight
                  : cat.color.item;
              return (
                <button
                  key={item}
                  onClick={() => toggleIngredient(item)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${cls}`}
                >
                  {isSel && <i className="bi bi-check text-xs mr-1">{""}</i>}
                  {shortIngredient(item)}
                </button>
              );
            })}
            {hiddenCount > 0 && !isExpanded && (
              <button
                onClick={() => toggleExpand(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-full border border-dashed transition-all duration-200 cursor-pointer font-medium ${cat.color.more}`}
              >
                +{hiddenCount} más
              </button>
            )}
            {isExpanded && (
              <button
                onClick={() => toggleExpand(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-full border border-dashed transition-all duration-200 cursor-pointer font-medium ${cat.color.more}`}
              >
                Ver menos
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (loading) return <p className="p-4 text-sm text-[#9B7A6A]">Cargando ingredientes…</p>;
  if (error) return <p className="p-4 text-sm text-red-400">{error}</p>;

  return (
    <aside className="w-72 h-full border-r-2 border-[#EDD9C8] dark:border-[#3a3a5c] flex flex-col flex-shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b-2 border-[#EDD9C8] dark:border-[#3a3a5c]">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-[#2C1810] dark:text-[#FFF8F0] text-base">
            Mis ingredientes
          </h2>
          {selected.length > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-[#FF6B6B] hover:underline cursor-pointer"
            >
              Limpiar todo
            </button>
          )}
        </div>
        <p className="text-xs text-[#9B7A6A] dark:text-[#a89088]">
          {selected.length} ingredientes seleccionados
        </p>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selected.map((item) => (
              <span
                key={item}
                onClick={() => toggleIngredient(item)}
                className="flex items-center gap-1 bg-[#FF6B6B]/15 text-[#FF6B6B] text-xs px-2 py-0.5 rounded-full cursor-pointer hover:bg-[#FF6B6B]/25 transition-colors"
              >
                {shortIngredient(item)}
                <i className="bi bi-x text-xs">{""}</i>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Buscador */}
      <div className="px-4 py-2 border-b-2 border-[#EDD9C8] dark:border-[#3a3a5c]">
        <div className="relative">
          <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#9B7A6A] text-xs">
            {""}
          </i>
          <input
            type="text"
            placeholder="Buscar ingrediente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FFF3EA] dark:bg-[#16213e] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#2C1810] dark:text-white placeholder-[#9B7A6A] outline-none focus:border-[#4ECDC4] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B7A6A] hover:text-[#FF6B6B] transition-colors"
            >
              <i className="bi bi-x text-xs">{""}</i>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll">
        {/* Categorías con coincidencias — flotan arriba con items resaltados */}
        {matchingCats.map((cat) => renderCategory(cat, false))}

        {/* Ingredientes opcionales (de cócteles, fuera de predefinidas) */}
        {optionalMatches.length > 0 && (
          <div className="mx-3 my-2 rounded-2xl overflow-hidden border-2 border-dashed border-[#4ECDC4]/60 dark:border-[#4ECDC4]/40">
            <div className="flex items-center justify-between px-4 py-3 bg-[#4ECDC4]/10 dark:bg-[#4ECDC4]/5 border-b-2 border-dashed border-[#4ECDC4]/40">
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span className="text-sm font-bold text-[#4ECDC4]">
                  Ingredientes opcionales
                </span>
              </div>
              <span className="text-[10px] text-[#4ECDC4]/70 font-medium">
                del pool de la plataforma
              </span>
            </div>
            <div className="px-3 pb-3 pt-2 flex flex-wrap gap-2">
              {optionalMatches.map((item) => {
                const isSel = selected.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleIngredient(item)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                      isSel
                        ? "bg-[#4ECDC4] border-[#4ECDC4] text-white"
                        : "bg-white dark:bg-[#16213e] border-[#4ECDC4]/50 dark:border-[#4ECDC4]/30 text-[#4ECDC4] hover:border-[#4ECDC4] hover:bg-[#4ECDC4]/10"
                    }`}
                  >
                    {isSel && <i className="bi bi-check text-xs mr-1">{""}</i>}
                    {shortIngredient(item)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Categorías sin coincidencias — van abajo atenuadas */}
        {dimmedCats.map((cat) => renderCategory(cat, true))}

        {/* Sin resultados en absoluto */}
        {nothingFound && (
          <div className="mx-3 my-2 px-4 py-3 rounded-2xl border-2 border-dashed border-[#EDD9C8] dark:border-[#3a3a5c] text-center">
            <p className="text-xs text-[#9B7A6A] dark:text-[#a89088]">
              No encontramos{" "}
              <span className="font-semibold text-[#2C1810] dark:text-[#FFF8F0]">
                &ldquo;{search}&rdquo;
              </span>{" "}
              en ningún cóctel.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
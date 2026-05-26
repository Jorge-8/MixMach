"use client";
import { useState, useEffect, useMemo } from "react";
import { normalizeText } from "@/utils/normalize";
import { API_BASE_URL } from "@/constants";

// ═══════════════════════════════════════════════════════════════
// Metadata visual — emojis, colores y orden. Los items vienen del back.
// ═══════════════════════════════════════════════════════════════
const CATEGORY_ORDER = ["Clásicos", "Tropicales", "Refrescantes", "Cremosos", "Sin alcohol", "Shots"];

const CATEGORY_META: Record<string, { id: string; emoji: string; color: any }> = {
  "Clásicos": {
    id: "clasicos", emoji: "🍸",
    color: {
      headerBg: "bg-amber-100 border-b-2 border-amber-200 dark:bg-amber-950/30",
      border: "border-2 border-amber-200 dark:border-amber-800",
      header: "text-amber-700 dark:text-amber-400",
      badge: "bg-amber-500",
      item: "bg-white dark:bg-amber-900/40 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:border-amber-500 hover:text-amber-600",
      itemActive: "bg-amber-500 border-amber-500 text-white",
      itemHighlight: "border-amber-500 ring-2 ring-amber-300 dark:ring-amber-600 bg-amber-50 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300",
      more: "bg-[#FFF1B9] text-amber-500 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/40",
    },
  },
  "Tropicales": {
    id: "tropicales", emoji: "🍹",
    color: {
      headerBg: "bg-orange-100 border-b-2 border-orange-200 dark:bg-orange-950/30",
      border: "border-2 border-orange-200 dark:border-orange-800",
      header: "text-orange-700 dark:text-orange-400",
      badge: "bg-orange-500",
      item: "bg-white dark:bg-orange-900/40 border-orange-200 dark:border-orange-700 text-orange-800 dark:text-orange-300 hover:border-orange-500 hover:text-orange-600",
      itemActive: "bg-orange-500 border-orange-500 text-white",
      itemHighlight: "border-orange-500 ring-2 ring-orange-300 dark:ring-orange-600 bg-orange-50 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300",
      more: "bg-orange-50 text-orange-500 border-orange-300 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/40",
    },
  },
  "Refrescantes": {
    id: "refrescantes", emoji: "🧊",
    color: {
      headerBg: "bg-blue-100 border-b-2 border-blue-200 dark:bg-blue-950/30",
      border: "border-2 border-blue-200 dark:border-blue-800",
      header: "text-blue-700 dark:text-blue-400",
      badge: "bg-blue-500",
      item: "bg-white dark:bg-blue-900/40 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300 hover:border-blue-500 hover:text-blue-600",
      itemActive: "bg-blue-500 border-blue-500 text-white",
      itemHighlight: "border-blue-500 ring-2 ring-blue-300 dark:ring-blue-600 bg-blue-50 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300",
      more: "bg-blue-50 text-blue-500 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/40",
    },
  },
  "Cremosos": {
    id: "cremosos", emoji: "🥛",
    color: {
      headerBg: "bg-pink-100 border-b-2 border-pink-200 dark:bg-pink-950/30",
      border: "border-2 border-pink-200 dark:border-pink-800",
      header: "text-pink-700 dark:text-pink-400",
      badge: "bg-pink-500",
      item: "bg-white dark:bg-pink-900/40 border-pink-200 dark:border-pink-700 text-pink-800 dark:text-pink-300 hover:border-pink-500 hover:text-pink-600",
      itemActive: "bg-pink-500 border-pink-500 text-white",
      itemHighlight: "border-pink-500 ring-2 ring-pink-300 dark:ring-pink-600 bg-pink-50 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300",
      more: "bg-pink-50 text-pink-500 border-pink-300 dark:border-pink-700 hover:bg-pink-50 dark:hover:bg-pink-900/40",
    },
  },
  "Sin alcohol": {
    id: "sin-alcohol", emoji: "🥤",
    color: {
      headerBg: "bg-green-100 border-b-2 border-green-200 dark:bg-green-950/30",
      border: "border-2 border-green-200 dark:border-green-800",
      header: "text-green-700 dark:text-green-400",
      badge: "bg-green-500",
      item: "bg-white dark:bg-green-900/40 border-green-200 dark:border-green-700 text-green-800 dark:text-green-300 hover:border-green-500 hover:text-green-600",
      itemActive: "bg-green-500 border-green-500 text-white",
      itemHighlight: "border-green-500 ring-2 ring-green-300 dark:ring-green-600 bg-green-50 dark:bg-green-900/60 text-green-700 dark:text-green-300",
      more: "bg-green-50 text-green-500 border-green-300 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/40",
    },
  },
  "Shots": {
    id: "shots", emoji: "🥃",
    color: {
      headerBg: "bg-purple-100 border-b-2 border-purple-200 dark:bg-purple-950/30",
      border: "border-2 border-purple-200 dark:border-purple-800",
      header: "text-purple-700 dark:text-purple-400",
      badge: "bg-purple-500",
      item: "bg-white dark:bg-purple-900/40 border-purple-200 dark:border-purple-700 text-purple-800 dark:text-purple-300 hover:border-purple-500 hover:text-purple-600",
      itemActive: "bg-purple-500 border-purple-500 text-white",
      itemHighlight: "border-purple-500 ring-2 ring-purple-300 dark:ring-purple-600 bg-purple-50 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300",
      more: "bg-purple-50 text-purple-500 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/40",
    },
  },
};

const VISIBLE_COUNT = 8;

export interface BeverageFilters {
  difficulty: "facil" | "medio" | "dificil" | null;
  is_alcoholic: "alcohol" | "sin-alcohol" | null;
  maxIngr: number | null;
}

interface Props {
  onChange?: (selected: string[]) => void;
  onFiltersChange?: (filters: BeverageFilters) => void;
}

type Category = { id: string; emoji: string; name: string; color: any; items: string[] };

export default function BeverageSidebar({ onChange, onFiltersChange }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const [difficulty, setDifficulty] = useState<BeverageFilters["difficulty"]>(null);
  const [is_alcoholic, setIsAlcoholic] = useState<BeverageFilters["is_alcoholic"]>(null);
  const [maxIngr, setMaxIngr] = useState<number | null>(null);
  const [maxIngrRange, setMaxIngrRange] = useState<number>(10);

  const [categories, setCategories] = useState<Category[]>([]);
  const [optionalPool, setOptionalPool] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { onChange?.(selected); }, [selected]); // eslint-disable-line
  
  useEffect(() => {
    onFiltersChange?.({
      difficulty,
      is_alcoholic,
      maxIngr: maxIngr ?? maxIngrRange, // null si no hay botón seleccionado
    });
  }, [difficulty, is_alcoholic, maxIngr, maxIngrRange]); // eslint-disable-line

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/beverages/categories/`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Error al cargar catálogo de bebidas");
        const data: { id: number; name: string; category: string | null }[] = await res.json();

        // Agrupar bebidas por su campo "category"
        const map = new Map<string, string[]>();
        for (const item of data) {
          const cat = item.category ?? "Otros";
          if (!map.has(cat)) map.set(cat, []);
          map.get(cat)!.push(item.name);
        }

        // Construir categorías en orden + metadata visual
        const built: Category[] = CATEGORY_ORDER
          .filter((catName) => map.has(catName))
          .map((catName) => ({
            ...CATEGORY_META[catName],
            name: catName,
            items: map.get(catName)!.sort((a, b) => a.localeCompare(b, "es")),
          }));

        // Extras: grupos no contemplados en CATEGORY_ORDER
        const extras: string[] = [];
        for (const [catName, names] of map.entries()) {
          if (!CATEGORY_ORDER.includes(catName)) extras.push(...names);
        }

        setCategories(built);
        setOptionalPool(extras);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el catálogo");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const qNorm = useMemo(() => normalizeText(search.trim()), [search]);
  const isSearching = search.trim().length > 0;

  const { matchingCats, dimmedCats } = useMemo(() => {
    if (!isSearching) return { matchingCats: categories, dimmedCats: [] as Category[] };
    const matching: Category[] = [];
    const dimmed: Category[] = [];
    for (const cat of categories) {
      cat.items.some((i) => normalizeText(i).includes(qNorm))
        ? matching.push(cat)
        : dimmed.push(cat);
    }
    return { matchingCats: matching, dimmedCats: dimmed };
  }, [isSearching, qNorm, categories]);

  const optionalMatches = useMemo<string[]>(() => {
    if (!isSearching) return [];
    return optionalPool.filter((n) => normalizeText(n).includes(qNorm));
  }, [isSearching, qNorm, optionalPool]);

  const nothingFound = isSearching && matchingCats.length === 0 && optionalMatches.length === 0;

  function toggleItem(item: string) {
    setSelected((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);
  }
  function toggleCollapse(id: string) {
    setCollapsed((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }
  function toggleExpand(id: string) {
    setExpanded((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }
  function clearAll() { setSelected([]); }

  function renderCategory(cat: Category, dimmed = false) {
    const isCollapsed = collapsed.includes(cat.id);
    const isExpanded = expanded.includes(cat.id);
    const selectedItems = cat.items.filter((i) => selected.includes(i));
    const nonSelected = cat.items.filter((i) => !selected.includes(i));

    let ordered: string[];
    if (isSearching && !dimmed) {
      const hits = nonSelected.filter((i) => normalizeText(i).includes(qNorm));
      const rest = nonSelected.filter((i) => !normalizeText(i).includes(qNorm));
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
            <span className={`text-sm font-bold ${cat.color.header}`}>{cat.name}</span>
            {selectedItems.length > 0 && (
              <span className={`w-5 h-5 ${cat.color.badge} text-white text-[10px] font-bold rounded-full flex items-center justify-center`}>
                {selectedItems.length}
              </span>
            )}
          </div>
          <i className={`bi bi-chevron-${isCollapsed ? "down" : "up"} text-xs ${cat.color.header}`}>{""}</i>
        </button>

        {!isCollapsed && (
          <div className="px-3 pb-3 pt-2 flex flex-wrap gap-2">
            {visible.map((item) => {
              const isSel = selected.includes(item);
              const isHit = isSearching && !dimmed && normalizeText(item).includes(qNorm);
              const cls = isSel ? cat.color.itemActive : isHit ? cat.color.itemHighlight : cat.color.item;
              return (
                <button
                  key={item}
                  onClick={() => toggleItem(item)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${cls}`}
                >
                  {isSel && <i className="bi bi-check text-xs mr-1">{""}</i>}
                  {item}
                </button>
              );
            })}
            {hiddenCount > 0 && !isExpanded && (
              <button onClick={() => toggleExpand(cat.id)} className={`text-xs px-3 py-1.5 rounded-full border border-dashed transition-all duration-200 cursor-pointer font-medium ${cat.color.more}`}>
                +{hiddenCount} más
              </button>
            )}
            {isExpanded && (
              <button onClick={() => toggleExpand(cat.id)} className={`text-xs px-3 py-1.5 rounded-full border border-dashed transition-all duration-200 cursor-pointer font-medium ${cat.color.more}`}>
                Ver menos
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (loading) return <p className="p-4 text-sm text-[#9B7A6A]">Cargando catálogo...</p>;
  if (error) return <p className="p-4 text-sm text-red-400">{error}</p>;

  return (
    <aside className="w-72 h-full border-r-2 border-[#EDD9C8] dark:border-[#3a3a5c] flex flex-col flex-shrink-0 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b-2 border-[#EDD9C8] dark:border-[#3a3a5c]">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-bold text-[#2C1810] dark:text-[#FFF8F0] text-base">Bebidas</h2>
          {selected.length > 0 && (
            <button onClick={clearAll} className="text-xs text-[#FF6B6B] hover:underline cursor-pointer">
              Limpiar todo
            </button>
          )}
        </div>
        <p className="text-xs text-[#9B7A6A] dark:text-[#a89088]">{selected.length} bebidas seleccionadas</p>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selected.map((item) => (
              <span
                key={item}
                onClick={() => toggleItem(item)}
                className="flex items-center gap-1 bg-[#FF6B6B]/15 text-[#FF6B6B] text-xs px-2 py-0.5 rounded-full cursor-pointer hover:bg-[#FF6B6B]/25 transition-colors"
              >
                {item}
                <i className="bi bi-x text-xs">{""}</i>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Buscador */}
      <div className="px-4 py-2 border-b-2 border-[#EDD9C8] dark:border-[#3a3a5c]">
        <div className="relative">
          <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#9B7A6A] text-xs">{""}</i>
          <input
            type="text"
            placeholder="Buscar bebida..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FFF3EA] dark:bg-[#16213e] border border-[#EDD9C8] dark:border-[#3a3a5c] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#2C1810] dark:text-white placeholder-[#9B7A6A] outline-none focus:border-[#4ECDC4] transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B7A6A] hover:text-[#FF6B6B] transition-colors">
              <i className="bi bi-x text-xs">{""}</i>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scroll">
        <FiltersBlock
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          is_alcoholic={is_alcoholic}
          setIsAlcoholic={setIsAlcoholic}
          maxIngr={maxIngr}
          setMaxIngr={setMaxIngr}
          maxIngrRange={maxIngrRange}
          setMaxIngrRange={setMaxIngrRange}
        />

        {matchingCats.map((cat) => renderCategory(cat, false))}

        {optionalMatches.length > 0 && (
          <div className="mx-3 my-2 rounded-2xl overflow-hidden border-2 border-dashed border-[#4ECDC4]/60 dark:border-[#4ECDC4]/40">
            <div className="flex items-center justify-between px-4 py-3 bg-[#4ECDC4]/10 dark:bg-[#4ECDC4]/5 border-b-2 border-dashed border-[#4ECDC4]/40">
              <div className="flex items-center gap-2">
                <span>✨</span>
                <span className="text-sm font-bold text-[#4ECDC4]">Bebidas opcionales</span>
              </div>
              <span className="text-[10px] text-[#4ECDC4]/70 font-medium">del catálogo</span>
            </div>
            <div className="px-3 pb-3 pt-2 flex flex-wrap gap-2">
              {optionalMatches.map((item) => {
                const isSel = selected.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleItem(item)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${isSel ? "bg-[#4ECDC4] border-[#4ECDC4] text-white" : "bg-white dark:bg-[#16213e] border-[#4ECDC4]/50 dark:border-[#4ECDC4]/30 text-[#4ECDC4] hover:border-[#4ECDC4] hover:bg-[#4ECDC4]/10"}`}
                  >
                    {isSel && <i className="bi bi-check text-xs mr-1">{""}</i>}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {dimmedCats.map((cat) => renderCategory(cat, true))}

        {nothingFound && (
          <div className="mx-3 my-2 px-4 py-3 rounded-2xl border-2 border-dashed border-[#EDD9C8] dark:border-[#3a3a5c] text-center">
            <p className="text-xs text-[#9B7A6A] dark:text-[#a89088]">
              No encontramos{" "}
              <span className="font-semibold text-[#2C1810] dark:text-[#FFF8F0]">&ldquo;{search}&rdquo;</span>{" "}
              en el catálogo.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

// ── Filtros — lógica 100% del front ──
interface FiltersProps {
  difficulty: BeverageFilters["difficulty"];
  setDifficulty: (v: BeverageFilters["difficulty"]) => void;
  is_alcoholic: BeverageFilters["is_alcoholic"];
  setIsAlcoholic: (v: BeverageFilters["is_alcoholic"]) => void;
  maxIngr: number | null;
  setMaxIngr: (v: number | null) => void;
  maxIngrRange: number;
  setMaxIngrRange: (v: number) => void;
}

function FiltersBlock({ difficulty, setDifficulty, is_alcoholic, setIsAlcoholic, maxIngr, setMaxIngr, maxIngrRange, setMaxIngrRange }: FiltersProps) {
  return (
    <div className="p-4 border-b-2 border-[#EDD9C8] dark:border-[#3a3a5c] flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-[#2C1810] dark:text-[#FFF8F0] uppercase tracking-wide">Dificultad</p>
        <div className="flex gap-1 flex-wrap">
          {(["facil", "medio", "dificil"] as const).map((d) => (
            <button key={d} onClick={() => setDifficulty(difficulty === d ? null : d)}
              className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 cursor-pointer ${difficulty === d ? "bg-[#4ECDC4] border-[#4ECDC4] text-white" : "bg-white dark:bg-[#16213e] border-[#EDD9C8] dark:border-[#3a3a5c] text-[#9B7A6A] hover:border-[#4ECDC4] hover:text-[#4ECDC4]"}`}>
              {d === "facil" ? "Fácil" : d === "medio" ? "Medio" : "Difícil"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-[#2C1810] dark:text-[#FFF8F0] uppercase tracking-wide">Tipo</p>
        <div className="flex gap-1 flex-wrap">
          {(["alcohol", "sin-alcohol"] as const).map((t) => (
            <button key={t} onClick={() => setIsAlcoholic(is_alcoholic === t ? null : t)}
              className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 cursor-pointer ${is_alcoholic === t ? "bg-[#FF6B6B] border-[#FF6B6B] text-white" : "bg-white dark:bg-[#16213e] border-[#EDD9C8] dark:border-[#3a3a5c] text-[#9B7A6A] hover:border-[#FF6B6B] hover:text-[#FF6B6B]"}`}>
              {t === "alcohol" ? "Con alcohol" : "Sin alcohol"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-[#2C1810] dark:text-[#FFF8F0] uppercase tracking-wide">Máximo de ingredientes</p>
        <div className="flex gap-1 flex-wrap">
          {[{ label: "4 o menos", value: 4 }, { label: "5", value: 5 }, { label: "6", value: 6 }, { label: "7", value: 7 }].map((opt) => (
            <button key={opt.value} onClick={() => setMaxIngr(maxIngr === opt.value ? null : opt.value)}
              className={`text-xs px-3 py-1 rounded-full border transition-all duration-200 cursor-pointer ${maxIngr === opt.value ? "bg-[#FFD93D] border-[#FFD93D] text-[#2C1810]" : "bg-white dark:bg-[#16213e] border-[#EDD9C8] dark:border-[#3a3a5c] text-[#9B7A6A] hover:border-[#FFD93D]"}`}>
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex justify-between text-[10px] text-[#9B7A6A] dark:text-[#a89088]">
            <span>Rango</span>
            <span className="font-semibold text-[#4ECDC4]">{maxIngrRange} ingredientes</span>
          </div>
          <input type="range" min={1} max={15} value={maxIngrRange}
            onChange={(e) => { setMaxIngrRange(Number(e.target.value)); setMaxIngr(null); }}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#4ECDC4] bg-[#EDD9C8] dark:bg-[#3a3a5c]"
          />
          <div className="flex justify-between text-[10px] text-[#9B7A6A] dark:text-[#a89088]">
            <span>1</span><span>15</span>
          </div>
        </div>
      </div>
    </div>
  );
}
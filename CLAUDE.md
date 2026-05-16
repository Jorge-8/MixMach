# CLAUDE.md — Guía para agentes de IA sobre MixMatch

## ¿Qué es MixMatch?

Aplicación web para encontrar cócteles según los ingredientes que tienes en casa. Las rutas públicas no requieren login; el login solo desbloquea funciones como favoritos y recetas personalizadas.

---

## Stack tecnológico

- **Framework**: Next.js 16 con App Router y Turbopack
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Iconos**: Bootstrap Icons (`npm install bootstrap-icons`)
- **Fuente**: Poppins (importada desde `next/font/google`)
- **Backend**: Django REST Framework (aún no conectado)

---

## Reglas de extensiones

| Archivo                                  | Extensión | Razón                |
| ---------------------------------------- | --------- | -------------------- |
| Componentes, páginas                     | `.tsx`    | Contienen JSX        |
| Hooks, services, types, utils, constants | `.ts`     | Solo lógica, sin JSX |

**Regla simple**: ¿tiene `<etiquetas HTML>`? → `.tsx`. Si no → `.ts`

---

## Estructura de carpetas

```
mixmatch/
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx              ← layout raíz global
    │   ├── page.tsx                ← landing pública /
    │   ├── globals.css             ← estilos globales + scrollbar
    │   ├── (auth)/
    │   │   ├── login/page.tsx      ← /login
    │   │   └── register/page.tsx   ← /register
    │   └── (main)/
    │       ├── match/page.tsx      ← /match — buscar bebidas
    │       ├── ingredients/page.tsx
    │       ├── favorites/page.tsx
    │       ├── my-recipes/page.tsx
    │       └── profile/page.tsx    ← muestra LoginForm o ProfileCard
    │
    ├── components/
    │   ├── auth/
    │   │   ├── LoginForm.tsx
    │   │   ├── RegisterForm.tsx
    │   │   └── ProfileCard.tsx
    │   ├── ingredients/
    │   │   ├── IngredientSidebar.tsx  ← sidebar de ingredientes (inicio)
    │   │   └── BeverageSidebar.tsx    ← sidebar de bebidas (match)
    │   ├── match/
    │   │   ├── CocktailGrid.tsx    ← grid de tarjetas de cócteles
    │   │   ├── CocktailCard.tsx    ← tarjeta individual de cóctel
    │   │   └── CocktailModal.tsx   ← ventana emergente de detalle
    │   └── ui/
    │       ├── Sidebar.tsx
    │       ├── ThemeToggle.tsx
    │       ├── Button.tsx
    │       └── Input.tsx
    │
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── useCocktails.ts
    │   ├── useIngredients.ts       ← TODO BACKEND: descomentar cuando conecte
    │   └── useFavorites.ts
    │
    ├── services/
    │   ├── authService.ts
    │   ├── cocktailService.ts
    │   ├── ingredientService.ts    ← TODO BACKEND: descomentar cuando conecte
    │   └── favoriteService.ts
    │
    ├── types/
    │   ├── ICocktail.ts
    │   ├── IUser.ts
    │   ├── IIngredient.ts
    │   └── ICategory.ts
    │
    ├── utils/
    │   ├── formatDate.ts
    │   └── validateToken.ts
    │
    └── constants/
        └── index.ts                ← API_BASE_URL, APP_NAME, etc.
```

---

## Convenciones de nomenclatura

| Tipo                | Convención                  | Ejemplo          |
| ------------------- | --------------------------- | ---------------- |
| Componentes         | PascalCase                  | `LoginForm.tsx`  |
| Hooks               | camelCase con prefijo `use` | `useAuth.ts`     |
| Interfaces/tipos    | Prefijo `I` + PascalCase    | `ICocktail.ts`   |
| Constantes globales | UPPER_SNAKE_CASE            | `API_BASE_URL`   |
| Páginas             | siempre `page.tsx`          | `login/page.tsx` |

---

## Rutas y quién las ve

| Ruta          | Archivo                      | Requiere login                 |
| ------------- | ---------------------------- | ------------------------------ |
| `/`           | `app/page.tsx`               | No — landing pública           |
| `/login`      | `(auth)/login/page.tsx`      | No                             |
| `/register`   | `(auth)/register/page.tsx`   | No                             |
| `/match`      | `(main)/match/page.tsx`      | No                             |
| `/favorites`  | `(main)/favorites/page.tsx`  | Sí (futuro)                    |
| `/my-recipes` | `(main)/my-recipes/page.tsx` | Sí (futuro)                    |
| `/profile`    | `(main)/profile/page.tsx`    | Muestra login si no hay sesión |

---

## Colores del proyecto

```
#FF6B6B  ← rojo/coral   (primario, botones, errores, ingredientes faltantes)
#4ECDC4  ← turquesa     (secundario, acentos, focus, match 100%)
#FFD93D  ← amarillo     (terciario, warnings, match ≥70%)
#2C1810  ← café oscuro  (texto principal)
#9B7A6A  ← café medio   (texto secundario, placeholders)
#EDD9C8  ← durazno      (bordes, fondos suaves)
#FFF3EA  ← crema        (fondo de inputs)
#FFF8F0  ← blanco cálido (fondo general)
#1a1a2e  ← azul oscuro  (fondo modo oscuro)
#16213e  ← azul medio   (inputs modo oscuro)
#3a3a5c  ← azul gris    (bordes modo oscuro)
#0f0f23  ← casi negro   (sidebar modo oscuro)
```

---

## Tipografía

**Poppins** — importada en `app/layout.tsx`:

```tsx
import { Poppins } from "next/font/google";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});
```

Aplicada globalmente en `globals.css`:

```css
* {
  font-family: var(--font-poppins);
}
```

---

## Modo oscuro

Usa la clase `dark` en el `<html>`. Configurado en `globals.css`:

```css
@variant dark (&:where(.dark, .dark *));
```

Gestionado por `ThemeToggle.tsx` que escribe en `localStorage` y agrega/quita la clase al `document.documentElement`.

Patrón de uso en componentes:

```tsx
className = "bg-[#FFFFFF] dark:bg-[#1a1a2e] text-[#2C1810] dark:text-[#FFF8F0]";
```

---

## Scrollbar personalizado

Clase `custom-scroll` definida en `globals.css`:

```css
.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #edd9c8;
  border-radius: 999px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #4ecdc4;
}
.dark .custom-scroll::-webkit-scrollbar-thumb {
  background: #3a3a5c;
}
```

---

## Autenticación (simulada — sin backend real)

El estado de sesión se guarda en `localStorage`:

```ts
localStorage.setItem("isLoggedIn", "true"); // al hacer login
localStorage.removeItem("isLoggedIn"); // al cerrar sesión
```

---

## Validaciones de formularios

### RegisterForm

- **Nombre**: requerido, no vacío
- **Correo**: debe tener `@` y `.com`
- **Contraseña**: mínimo 3/4 puntos de fortaleza (8+ chars, mayúscula, número, símbolo)
- **Confirmar contraseña**: debe coincidir exactamente

### LoginForm

- **Correo**: debe tener `@` y `.com`
- **Contraseña**: requerida, no vacía

---

## Componentes principales y su responsabilidad

### `app/layout.tsx`

- Importa Poppins, Bootstrap Icons, Sidebar, globals.css
- Renderiza `<Sidebar />` + `<main>` con círculos difuminados de fondo

### `components/ui/Sidebar.tsx`

- Navegación lateral fija con Bootstrap Icons
- Usa `usePathname()` para marcar el item activo
- Incluye `ThemeToggle` al fondo

### `components/ingredients/IngredientSidebar.tsx`

- Sidebar de ingredientes para `app/page.tsx` (inicio)
- Props: `showFilters`, `onChange`, `onSearch`
- **IMPORTANTE — bug corregido**: `onChange` se llama en `useEffect`, NO dentro del setter de `setSelected`. Llamarlo dentro del setter causaba el error de React "Cannot update a component while rendering another component".
- Categorías con colores únicos por categoría
- Buscador que filtra en tiempo real dentro del `map`
- Botón "+N más" muestra 8 items por defecto (`VISIBLE_COUNT = 8`)
- Los seleccionados aparecen primero en cada categoría

### `components/match/CocktailGrid.tsx`

- Grid responsivo de tarjetas de cócteles
- Recibe `selectedIngredients: string[]` del `page.tsx`
- Calcula el match de cada cóctel con los ingredientes seleccionados
- Muestra estado vacío si no hay ingredientes seleccionados o no hay coincidencias
- Ordena los resultados por porcentaje de compatibilidad descendente

### `components/match/CocktailCard.tsx`

- Tarjeta individual de cóctel
- Muestra imagen, badge de dificultad, badge de porcentaje, barra de progreso
- Badge verde (100%), amarillo (≥70%), rojo (<70%)
- Hover: eleva la tarjeta con sombra

### `components/match/CocktailModal.tsx`

- Ventana emergente al hacer clic en una tarjeta
- **Botones cerrar y favorito**: fondo `bg-black/60` con `backdrop-blur-md` y borde `border-white/30` para ser visibles sobre cualquier imagen
- **Etiquetas** (dificultad, alcohólico, cantidad): se muestran dentro de la imagen, debajo de la descripción, con fondo `bg-black/50 backdrop-blur-sm`
- **Ingredientes**: ✅ paloma verde (`bi-check-circle-fill`) si el usuario tiene el ingrediente, ✗ tache rojo (`bi-x-circle-fill`) si no lo tiene
- **Nota de cierre**: siempre visible al final, mensaje rotativo basado en `cocktail.id % CLOSING_NOTES.length`
- Favorito: toggle local por ahora — TODO BACKEND conectar con `favoriteService`

---

## Patrón TODO BACKEND

```ts
// ═══════════════════════════════════════════════════════════════
// TODO BACKEND: eliminar este bloque cuando se conecte al back
// Reemplazar con: const { categories, loading, error } = useIngredients();
// ═══════════════════════════════════════════════════════════════
const categories = [...]; // datos estáticos temporales
// FIN bloque a eliminar cuando se conecte al back
// ═══════════════════════════════════════════════════════════════

// TODO BACKEND: descomentar cuando se conecte al back
// import { useIngredients } from "@/hooks/useIngredients";
// const { categories, loading, error } = useIngredients();
// if (loading) return <p>Cargando...</p>;
// if (error)   return <p>{error}</p>;
```

---

## Archivos listos para el backend (comentados)

| Archivo                         | Endpoint esperado                                      |
| ------------------------------- | ------------------------------------------------------ |
| `services/ingredientService.ts` | `GET /api/ingredients/categories/`                     |
| `hooks/useIngredients.ts`       | Consume `ingredientService`                            |
| `services/cocktailService.ts`   | `GET /api/cocktails/`                                  |
| `hooks/useCocktails.ts`         | Consume `cocktailService`                              |
| `services/favoriteService.ts`   | `POST /api/favorites/` · `DELETE /api/favorites/{id}/` |
| `hooks/useFavorites.ts`         | Consume `favoriteService`                              |
| `types/IIngredient.ts`          | `{ id: number, name: string }`                         |
| `types/ICategory.ts`            | `{ id, name, emoji, items: IIngredient[] }`            |
| `constants/index.ts`            | `NEXT_PUBLIC_API_URL` del `.env.local`                 |

---

## Variables de entorno

`.env.local` (nunca subir al repo):

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

`.env.example` (sí subir al repo):

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## `globals.css` — estructura actual

```css
@import "tailwindcss";
@variant dark (&:where(.dark, .dark *));

:root {
  --background: #fff8f0;
  --foreground: #2c1810;
}
.dark {
  --background: #1a1a2e;
  --foreground: #fff8f0;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --width-18: 72px;
  --text-14: 14px;
}

* {
  font-family: var(--font-poppins);
}
body {
  background: var(--background);
  color: var(--foreground);
}

.custom-scroll::-webkit-scrollbar {
  width: 4px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: #edd9c8;
  border-radius: 999px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #4ecdc4;
}
.dark .custom-scroll::-webkit-scrollbar-thumb {
  background: #3a3a5c;
}
.dark .custom-scroll::-webkit-scrollbar-thumb:hover {
  background: #4ecdc4;
}
```

---

## Estado actual del proyecto

### ✅ Completado

- Layout global con Sidebar, Poppins, círculos de fondo, modo oscuro
- Página de inicio (`/`) con `IngredientSidebar` sin filtros + `CocktailGrid`
- Página de búsqueda (`/match`) con `BeverageSidebar` con filtros
- Login con validación, mostrar/ocultar contraseña, modal de éxito
- Registro con validación, fortaleza de contraseña, modal de verificación con 6 dígitos
- Flujo completo: registro → verificación → login → perfil
- Perfil: muestra `LoginForm` si no hay sesión, `ProfileCard` si hay sesión
- Modo oscuro con `ThemeToggle` persistente en `localStorage`
- Scrollbar personalizado con clase `custom-scroll`
- Sidebar de ingredientes con colores por categoría, búsqueda, "+N más"
- Sidebar de bebidas con las mismas funcionalidades
- **`CocktailGrid`**: grid responsivo con cálculo de match por ingredientes seleccionados
- **`CocktailCard`**: tarjeta con imagen, dificultad, porcentaje y barra de progreso
- **`CocktailModal`**: detalle completo con etiquetas sobre imagen, ingredientes con check/tache, preparación, tip y nota de cierre
- Bug corregido: `onChange` en `IngredientSidebar` se llama en `useEffect` para evitar error de React al actualizar un componente mientras se renderiza otro
- Archivos de backend preparados y comentados

### 🔄 Pendiente

- Conectar con Django REST Framework
- Página de favoritos (`/favorites`)
- Página de mis recetas (`/my-recipes`)
- Página de detalle de receta (`/recipe-detail/[id]`)
- Guard de autenticación real con JWT
- Conectar botón favorito en `CocktailModal` con `favoriteService`
- Reemplazar match por ingrediente específico (actualmente es aproximación por orden)

---

## Notas importantes para Claude

1. **No cambiar colores** sin que el usuario lo pida explícitamente
2. **No cambiar la estructura de carpetas** sin confirmación
3. **Siempre agregar comentarios TODO BACKEND** en datos estáticos
4. **Usar `"use client"`** en cualquier componente con `useState`, `useEffect`, `onClick`, `onChange`
5. **No usar `localStorage` en Server Components** — solo en Client Components
6. **El `useEffect` con `setState`** puede dar warning — usar `setTimeout(() => setState(...), 0)`
7. **Tailwind v4** usa `@import "tailwindcss"` no `@tailwind base/components/utilities`
8. **Modo oscuro** siempre agregar `dark:` en colores de fondo, texto y bordes
9. **Bootstrap Icons** usar `<i className="bi bi-nombre">{""}</i>` (con string vacío adentro)
10. **`w-18`** está definido en `@theme inline` como `--width-18: 72px`
11. **CRÍTICO — `onChange` en callbacks de `setState`**: NUNCA llamar un prop callback dentro del setter de `useState` (ej: `setSelected(prev => { onChange(next); return next; })`). Esto provoca el error "Cannot update a component while rendering another component". Usar `useEffect` para propagar cambios hacia el padre.
12. **Botones sobre imágenes**: usar `bg-black/60 backdrop-blur-md border border-white/30` para que sean visibles sobre cualquier foto
13. **Etiquetas en modales**: van dentro de la imagen, debajo de la descripción, con `bg-black/50 backdrop-blur-sm border border-white/20 text-white`
14. **Ingredientes en modal**: paloma verde `bi-check-circle-fill` si el usuario tiene el ingrediente, tache rojo `bi-x-circle-fill` si no lo tiene
15. **Nota de cierre en modal**: siempre presente al final, no es configurable por el usuario

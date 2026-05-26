# 🍹 Mixmatch

Aplicación web para la recomendación de bebidas y cócteles basada en los ingredientes disponibles. Desarrollada con Next.js + TypeScript en el frontend y Django + PostgreSQL en el backend.

---

## Requisitos de Visual Studio Code

### Instalación

Instala la siguiente extensión:

- **Prettier - Code formatter**

### Configuración

Verifica que el entorno esté correctamente configurado siguiendo estos pasos:

1. Presiona `Ctrl + Shift + P`
2. Escribe `Preferences: Open Settings (UI)`
3. Busca `Format On Save`
4. Activa la opción (**ON** o ✔️)

> Esta configuración es necesaria para que el formateo automático funcione correctamente al guardar.

## Requisitos previos

Antes de correr el proyecto asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) versión 18 o superior
- [Git](https://git-scm.com/)
- npm (viene incluido con Node.js)

Para verificar que los tienes instalados:

```bash
node --version
npm --version
git --version
```

---

## Correr el proyecto localmente (desde cero)

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/mixmatch.git
```

### 2. Entra a la carpeta del proyecto

```bash
cd mixmatch
```

### 3. Instala las dependencias

```bash
npm install
```

### 4. Configura las variables de entorno

Copia el archivo de ejemplo y llena los valores:

```bash
copy .env.example .env.local
```

Abre `.env.local` y completa los valores:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Mixmatch
```

### 5. Corre el servidor de desarrollo

```bash
npm run dev
```

Abre tu navegador en [http://localhost:3000](http://localhost:3000) y listo.

---

## Bajar cambios del repositorio (pull)

Cuando alguien del equipo sube cambios y quieres tenerlos en tu máquina:

```bash
# Asegúrate de estar en la rama develop
git checkout develop

# Baja los cambios
git pull origin develop
```

Si alguien modificó dependencias (el `package.json` cambió), vuelve a instalar:

```bash
npm install
```

---

## Subir cambios al repositorio (push)

Sigue el flujo de Git definido en el plan de calidad:

### 1. Crea tu rama feature desde develop

```bash
git checkout develop
git pull origin develop
git checkout -b feature/auth-login
```

El nombre de la rama sigue el formato: `feature/{tipo}-{descripcion}`

### 2. Haz tus cambios y verifica que pasan el linting

```bash
npm run lint
npm run format
```

### 3. Agrega los archivos modificados

```bash
# Agregar todos los archivos modificados
git add .

# O agregar un archivo específico
git add src/components/auth/LoginForm.tsx
```

### 4. Haz el commit con el formato del plan de calidad

```bash
git commit -m "feat(auth): agregar formulario de inicio de sesión"
```

Tipos de commit disponibles:

| Tipo       | Cuándo usarlo                     |
| ---------- | --------------------------------- |
| `feat`     | Nueva funcionalidad               |
| `fix`      | Corrección de bug                 |
| `docs`     | Solo documentación                |
| `style`    | Formato, sin cambio de lógica     |
| `refactor` | Reestructura sin cambio funcional |
| `test`     | Agregar o corregir pruebas        |
| `chore`    | Tareas de mantenimiento           |

### 5. Sube tu rama al repositorio

```bash
git push origin feature/auth-login
```

### 6. Abre un Pull Request en GitHub

Ve a GitHub y abre un Pull Request de tu rama `feature/auth-login` hacia `develop`. Asigna al menos un revisor.

---

## Scripts disponibles

| Comando                | Qué hace                                              |
| ---------------------- | ----------------------------------------------------- |
| `npm run dev`          | Inicia el servidor de desarrollo en localhost:3000    |
| `npm run build`        | Compila el proyecto para producción                   |
| `npm run start`        | Corre el proyecto compilado                           |
| `npm run lint`         | Revisa errores de ESLint en la carpeta src            |
| `npm run format`       | Formatea automáticamente todo el código con Prettier  |
| `npm run format:check` | Verifica si el código está formateado sin modificarlo |

---

## Estructura de carpetas

```
mixmatch/
├── public/                     # Archivos estáticos públicos (imágenes, íconos)
├── src/                        # Todo el código fuente de la aplicación
│   ├── app/                    # Rutas y páginas (Next.js App Router)
│   │   ├── (auth)/             # Grupo de rutas públicas (no requieren login)
│   │   │   ├── login/          # Página /login
│   │   │   └── register/       # Página /register
│   │   └── (main)/             # Grupo de rutas protegidas (requieren login)
│   │       ├── ingredients/    # Página /ingredients — M2: panel de ingredientes
│   │       ├── match/          # Página /match — M3: resultados del motor de match
│   │       ├── recipe-detail/  # Página /recipe-detail/[id] — M3: detalle de receta
│   │       │   └── [id]/       # Ruta dinámica, el [id] captura el número de la receta
│   │       ├── favorites/      # Página /favorites — M4: recetas favoritas
│   │       ├── my-recipes/     # Página /my-recipes — M4: recetas personalizadas
│   │       └── profile/        # Página /profile — M1: perfil de usuario
│   │
│   ├── components/             # Componentes React reutilizables (PascalCase.tsx)
│   │   ├── auth/               # Componentes de M1: formularios de login y registro
│   │   ├── ingredients/        # Componentes de M2: panel y tarjetas de ingredientes
│   │   ├── match/              # Componentes de M3: tarjetas de recetas y filtros
│   │   ├── favorites/          # Componentes de M4: botón y lista de favoritos
│   │   └── ui/                 # Componentes genéricos: Button, Input, Navbar, etc.
│   │
│   ├── hooks/                  # Hooks personalizados de React (camelCase con prefijo use)
│   │   ├── useAuth.ts          # Maneja login, logout y estado de autenticación
│   │   ├── useCocktails.ts     # Maneja la búsqueda y estado de cócteles
│   │   ├── useIngredients.ts   # Maneja la selección de ingredientes
│   │   └── useFavorites.ts     # Maneja guardar y eliminar favoritos
│   │
│   ├── services/               # Llamadas a la API REST del backend Django
│   │   ├── authService.ts      # Login, register, logout
│   │   ├── cocktailService.ts  # Buscar cócteles, obtener detalle
│   │   ├── ingredientService.ts # Obtener lista de ingredientes
│   │   └── favoriteService.ts  # Guardar y eliminar favoritos
│   │
│   ├── types/                  # Interfaces y tipos TypeScript (prefijo I + PascalCase)
│   │   ├── ICocktail.ts        # Estructura de datos de un cóctel
│   │   ├── IUser.ts            # Estructura de datos de un usuario
│   │   └── IIngredient.ts      # Estructura de datos de un ingrediente
│   │
│   ├── utils/                  # Funciones utilitarias pequeñas y reutilizables
│   │   ├── formatDate.ts       # Formatea fechas al estilo español (dd/mm/yyyy)
│   │   └── validateToken.ts    # Verifica si hay un token JWT válido en localStorage
│   │
│   └── constants/              # Constantes globales (UPPER_SNAKE_CASE)
│       └── index.ts            # API_BASE_URL, MAX_HISTORY_ITEMS, APP_NAME, etc.
│
├── .env.example                # Plantilla de variables de entorno (sí se sube al repo)
├── .env.local                  # Variables de entorno reales (NUNCA se sube al repo)
├── .gitignore                  # Archivos que Git debe ignorar
├── .prettierrc                 # Configuración de formato de código (Prettier)
├── .prettierignore             # Archivos que Prettier no debe formatear
├── eslint.config.mjs           # Configuración de reglas de ESLint
├── next.config.ts              # Configuración de Next.js
├── postcss.config.mjs          # Configuración de PostCSS (requerido por Tailwind)
├── tsconfig.json               # Configuración de TypeScript
├── package.json                # Dependencias y scripts del proyecto
├── AGENTS.md                   # Guía para agentes de IA sobre el proyecto
└── README.md                   # Este archivo
```

### ¿Qué va en cada carpeta?

**`app/`** — Solo archivos `page.tsx`, `layout.tsx` y `loading.tsx`. No pongas lógica aquí, solo llama a los componentes correspondientes.

**`components/`** — Todo lo visual. Cada componente tiene una sola responsabilidad. Si un componente lo usan varios módulos, va en `ui/`. Si solo lo usa un módulo, va en la carpeta de ese módulo.

**`hooks/`** — Toda la lógica de estado. Si un componente necesita manejar datos (loading, errores, llamadas al backend), esa lógica va en un hook, no dentro del componente.

**`services/`** — Todo `fetch()` va aquí. Ningún componente ni hook llama directamente a la API, siempre pasan por un service.

**`types/`** — Las interfaces TypeScript que definen cómo lucen los datos. Se usan en componentes, hooks y services para garantizar consistencia.

**`utils/`** — Funciones pequeñas y puras que se reutilizan en varios lugares. No tienen estado ni llaman a la API.

**`constants/`** — Valores que no cambian y se usan en varios archivos. Evita hardcodear strings o números mágicos en el código.

---

## Estrategia de ramas Git

```
main          → código estable de producción (solo recibe merges desde develop)
develop       → integración continua, base de trabajo del equipo
feature/...   → desarrollo de funcionalidades (se mergea a develop por PR)
fix/...       → corrección de bugs no urgentes
hotfix/...    → corrección urgente directo a main
docs/...      → actualizaciones de documentación
```

---

## Variables de entorno

| Variable               | Descripción             | Ejemplo                 |
| ---------------------- | ----------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL`  | URL del backend Django  | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la aplicación | `MixMatch`              |

> Las variables con prefijo `NEXT_PUBLIC_` son accesibles desde el navegador. Las que no tienen el prefijo solo están disponibles en el servidor.

---

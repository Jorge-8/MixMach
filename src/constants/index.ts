// MANTENER: esta constante se usa en todos los services
// TODO BACKEND: cuando se conecte al back verificar que
// NEXT_PUBLIC_API_URL esté definida en el .env.local
// Si no está definida usará localhost:8000 como fallback
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// TODO BACKEND: agregar al .env.local esta línea:
// NEXT_PUBLIC_API_URL=http://localhost:8000/api     ← desarrollo
// NEXT_PUBLIC_API_URL=https://tu-dominio.com/api   ← producción
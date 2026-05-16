// MANTENER: esta interfaz no cambia con el back
// Solo verificar que los campos coincidan con lo que responde Django
export interface ICocktailIngredient {
  name:   string; // MANTENER
  amount: string; // MANTENER — ej: "60 ml", "10 hojas", "al gusto"
}

export interface ICocktail {
  id:           number;   // MANTENER
  name:         string;   // MANTENER
  description:  string;   // MANTENER
  difficulty:   "Fácil" | "Medio" | "Difícil"; // MANTENER
  isAlcoholic:  boolean;  // MANTENER
  image:        string;   // MANTENER — URL de imagen del back
  ingredients:  ICocktailIngredient[]; // MANTENER
  steps:        string[]; // MANTENER — pasos de preparación
  tip?:         string;   // MANTENER — consejo final opcional
  isFavorite?:  boolean;  // TODO BACKEND: vendrá del back según el usuario logueado
}
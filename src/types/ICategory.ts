// MANTENER: esta interfaz no cambia con el back
// Solo verifica que los campos coincidan con lo que responde Django
import { IIngredient } from "./IIngredient";

export interface ICategory {
  id: number;             // MANTENER
  name: string;           // MANTENER
  emoji: string;          // MANTENER — verificar que el back lo mande
  items: IIngredient[];   // MANTENER — lista de ingredientes de la categoría
  // TODO BACKEND: si el back agrega más campos descomentarlos aquí
  // description?: string;
  // order?: number;
}
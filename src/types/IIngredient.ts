// MANTENER: esta interfaz no cambia con el back
// Solo verifica que los campos coincidan con lo que responde Django
export interface IIngredient {
  id: number;   // MANTENER: id numérico del ingrediente
  name: string; // MANTENER: nombre del ingrediente
  // TODO BACKEND: si el back agrega más campos descomentarlos aquí
  // category_id?: number;
  // image_url?: string;
}
import type { Categoria } from './Producto'

export type Disponibilidad = 'disponible' | 'agotado'

export interface Filtros {
  categorias: Categoria[]
  disponibilidad: Disponibilidad[]
  precioMinimo: number
  precioMaximo: number
}
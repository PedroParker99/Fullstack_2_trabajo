import type { Categoria } from './Producto'

export type Disponibilidad = 'disponible' | 'agotado'

export type OrdenProductos = 'caracteristicas' | 'precio-asc' | 'precio-desc' | 'nombre'

export interface Filtros {
  categorias: Categoria[]
  disponibilidad: Disponibilidad[]
  precioMinimo: number
  precioMaximo: number
}
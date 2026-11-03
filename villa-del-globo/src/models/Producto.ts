export type Categoria =
  | 'Set Decoración'
  | 'Globos'
  | 'Manteles'
  | 'Vasos y Vajilla'
  | 'Piñatas'
  | 'Accesorios'

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  precioAnterior?: number
  imagen: string
  tematica: string
  categoria: Categoria
  disponible: boolean
}
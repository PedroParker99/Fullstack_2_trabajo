export interface Producto {
  id: number
  nombre: string
  precio: number
  precioAnterior?: number
  imagen: string
  tematica: string
  disponible: boolean
}
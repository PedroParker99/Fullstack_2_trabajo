// Forma en que ms_producto devuelve un inventario (entidad Inventario.java).
export interface Inventario {
  id: number
  productoId: number
  cantidadDisponible: number
  stockMinimo: number
}

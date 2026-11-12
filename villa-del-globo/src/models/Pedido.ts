// Forma en que ms_pedido devuelve un pedido (entidad Pedido.java).
export interface Pedido {
  id: number
  usuarioId: number
  direccionId: number
  fechaPedido: string
  estado: string
  total: number
  direccionEntrega: string
}
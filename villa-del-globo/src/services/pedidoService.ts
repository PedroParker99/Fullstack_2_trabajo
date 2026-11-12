import type { DetallePedido } from '../models/DetallePedido'
import type { ItemCarrito } from '../models/ItemCarrito'
import type { Pedido } from '../models/Pedido'
import { apiPedidos } from './api'

// GET http://localhost:8083/api/pedidos
export const obtenerPedidos = async (): Promise<Pedido[]> => {
  const respuesta = await apiPedidos.get<Pedido[]>('/pedidos')
  return respuesta.data
}

// GET http://localhost:8083/api/pedidos/usuario/{usuarioId}
export const obtenerPedidosUsuario = async (usuarioId: number): Promise<Pedido[]> => {
  const respuesta = await apiPedidos.get<Pedido[]>(`/pedidos/usuario/${usuarioId}`)
  return respuesta.data
}

// POST http://localhost:8083/api/pedidos
// Convierte el carrito al formato que espera ms_pedido.
export const crearPedido = async (
  usuarioId: number,
  direccionId: number,
  items: ItemCarrito[]
): Promise<Pedido> => {
  const solicitud = {
    pedido: { usuarioId, direccionId },
    detalles: items.map((item) => ({
      productoId: item.producto.id,
      cantidad: item.cantidad,
    })),
  }

  const respuesta = await apiPedidos.post<Pedido>('/pedidos', solicitud)
  return respuesta.data
}

// GET http://localhost:8083/api/pedidos/{id}/detalles
export const obtenerDetallesPedido = async (pedidoId: number): Promise<DetallePedido[]> => {
  const respuesta = await apiPedidos.get<DetallePedido[]>(`/pedidos/${pedidoId}/detalles`)
  return respuesta.data
}

// PATCH http://localhost:8083/api/pedidos/{id}/estado
// Al cancelar, ms_pedido le devuelve el stock a ms_producto.
export const cambiarEstadoPedido = async (pedidoId: number, estado: string): Promise<Pedido> => {
  const respuesta = await apiPedidos.patch<Pedido>(`/pedidos/${pedidoId}/estado`, { estado })
  return respuesta.data
}
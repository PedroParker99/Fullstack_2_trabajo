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
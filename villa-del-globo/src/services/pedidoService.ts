import type { Pedido } from '../models/Pedido'
import { apiPedidos } from './api'

// GET http://localhost:8083/api/pedidos
export const obtenerPedidos = async (): Promise<Pedido[]> => {
  const respuesta = await apiPedidos.get<Pedido[]>('/pedidos')
  return respuesta.data
}
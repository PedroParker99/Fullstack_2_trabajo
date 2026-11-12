import type { Direccion } from '../models/Direccion'
import { apiDirecciones } from './api'

// GET http://localhost:8086/api/direcciones/usuario/{usuarioId}
export const obtenerDireccionesUsuario = async (usuarioId: number): Promise<Direccion[]> => {
  const respuesta = await apiDirecciones.get<Direccion[]>(`/direcciones/usuario/${usuarioId}`)
  return respuesta.data
}


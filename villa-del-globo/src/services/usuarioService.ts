import type { Usuario } from '../models/Usuario'
import { apiUsuarios } from './api'

// GET http://localhost:8082/api/usuarios
export const obtenerUsuarios = async (): Promise<Usuario[]> => {
  const respuesta = await apiUsuarios.get<Usuario[]>('/usuarios')
  return respuesta.data
}
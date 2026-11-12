import type { Usuario } from '../models/Usuario'
import { apiUsuarios } from './api'

// Datos que escribe la persona en el formulario de registro.
// Omit = "Usuario, pero sin id ni rol" (esos los pone el sistema).
export type NuevoUsuario = Omit<Usuario, 'id' | 'rol'>

// GET /api/usuarios
export const obtenerUsuarios = async (): Promise<Usuario[]> => {
  const respuesta = await apiUsuarios.get<Usuario[]>('/usuarios')
  return respuesta.data
}

// POST /api/usuarios
// ms_usuario exige que se envíe el id, así que calculamos el siguiente disponible.
export const crearUsuario = async (datos: NuevoUsuario): Promise<Usuario> => {
  const usuarios = await obtenerUsuarios()
  const siguienteId = Math.max(0, ...usuarios.map((u) => u.id)) + 1

  const respuesta = await apiUsuarios.post<Usuario>('/usuarios', {
    ...datos,
    id: siguienteId,
    rol: 'CLIENTE',
  })
  return respuesta.data
}
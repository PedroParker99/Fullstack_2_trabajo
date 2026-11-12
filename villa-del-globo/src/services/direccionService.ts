import type { Direccion } from '../models/Direccion'
import { apiDirecciones } from './api'

// GET http://localhost:8086/api/direcciones/usuario/{usuarioId}
export const obtenerDireccionesUsuario = async (usuarioId: number): Promise<Direccion[]> => {
  const respuesta = await apiDirecciones.get<Direccion[]>(`/direcciones/usuario/${usuarioId}`)
  return respuesta.data
}


// Datos que escribe el usuario (sin id, ni usuarioId, ni predeterminada)
export type DatosDireccion = Omit<Direccion, 'id' | 'usuarioId' | 'predeterminada'>

export const direccionVacia: DatosDireccion = {
  calle: '',
  numero: '',
  departamento: '',
  comuna: '',
  ciudad: '',
  region: '',
  referencia: '',
}

// PUT http://localhost:8086/api/direcciones/{id}
export const actualizarDireccion = async (direccion: Direccion): Promise<Direccion> => {
  const respuesta = await apiDirecciones.put<Direccion>(`/direcciones/${direccion.id}`, direccion)
  return respuesta.data
}

// POST http://localhost:8086/api/direcciones
// ms_direccion exige el id, así que calculamos el siguiente disponible.
export const crearDireccion = async (usuarioId: number, datos: DatosDireccion): Promise<Direccion> => {
  const todas = await apiDirecciones.get<Direccion[]>('/direcciones')
  const siguienteId = Math.max(0, ...todas.data.map((d) => d.id)) + 1

  const respuesta = await apiDirecciones.post<Direccion>('/direcciones', {
    ...datos,
    id: siguienteId,
    usuarioId,
    predeterminada: false,
  })
  return respuesta.data
}

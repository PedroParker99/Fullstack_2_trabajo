import { createContext } from 'react'
import type { Usuario } from '../models/Usuario'

export interface SesionContextType {
  usuario: Usuario | null
  iniciarSesion: (usuario: Usuario) => void
  cerrarSesion: () => void
}

export const SesionContext = createContext<SesionContextType | undefined>(undefined)

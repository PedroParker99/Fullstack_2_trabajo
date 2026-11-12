import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Usuario } from '../models/Usuario'
import { SesionContext } from './SesionContext'

const CLAVE_SESION = 'villa-del-globo-sesion'

// Lee la sesión guardada (si el navegador se recarga, el usuario sigue conectado).
function cargarSesion(): Usuario | null {
  try {
    const guardado = localStorage.getItem(CLAVE_SESION)
    return guardado ? (JSON.parse(guardado) as Usuario) : null
  } catch {
    return null
  }
}

export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(cargarSesion)

  useEffect(() => {
    try {
      if (usuario) {
        localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
      } else {
        localStorage.removeItem(CLAVE_SESION)
      }
    } catch {
      // Si el navegador bloquea el almacenamiento, la sesión dura hasta recargar.
    }
  }, [usuario])

  return (
    <SesionContext.Provider
      value={{
        usuario,
        iniciarSesion: setUsuario,
        cerrarSesion: () => setUsuario(null),
      }}
    >
      {children}
    </SesionContext.Provider>
  )
}

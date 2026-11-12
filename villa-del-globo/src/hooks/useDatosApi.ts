import { useEffect, useState } from 'react'

// Hook genérico: llama a una función que pide datos a un microservicio
// y maneja los estados de carga y error.
// Importante: "cargar" debe ser una función definida FUERA del componente
// (por ejemplo, la de un service), para que no se vuelva a llamar en cada render.
export function useDatosApi<T>(cargar: () => Promise<T>, valorInicial: T) {
  const [datos, setDatos] = useState<T>(valorInicial)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let activo = true

    cargar()
      .then((resultado) => {
        if (activo) setDatos(resultado)
      })
      .catch(() => {
        if (activo) setError('No se pudo conectar con el servidor.')
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [cargar])

  return { datos, cargando, error }
}
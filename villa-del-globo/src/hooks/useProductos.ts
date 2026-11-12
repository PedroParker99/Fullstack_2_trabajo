import { useEffect, useState } from 'react'
import type { Producto } from '../models/Producto'
import { obtenerProductosApi } from '../services/productoApiService'
import { obtenerProductos } from '../services/productoService'

export function useProductos() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let activo = true

        obtenerProductosApi()
            .then((datos) => {
                if (activo) setProductos(datos)
            })
            .catch(() => {
                if (activo) {
                    setProductos(obtenerProductos())
                    setError('No se pudo conectar con el servidor. Mostrando el catálogo local.')
                }
            })
            .finally(() => {
                if (activo) setCargando(false)
            })

        return () => {
            activo = false
        }
    }, [])

    return { productos, cargando, error }
}
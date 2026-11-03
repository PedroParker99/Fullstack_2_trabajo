import type { Filtros } from '../models/Filtros'
import type { Producto } from '../models/Producto'
import { normalizarTexto } from './texto'

// Si el valor está en la lista lo quita; si no está, lo agrega.
// Sirve para marcar y desmarcar checkboxes.
export const alternar = <T>(lista: T[], valor: T): T[] =>
  lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor]

// Devuelve solo los productos que cumplen la búsqueda y todos los filtros.
export const filtrarProductos = (
  productos: Producto[],
  busqueda: string,
  filtros: Filtros
): Producto[] => {
  const textoBuscado = normalizarTexto(busqueda.trim())

  return productos.filter((producto) => {
    const textoProducto = normalizarTexto(
      `${producto.nombre} ${producto.tematica} ${producto.categoria} ${producto.descripcion}`
    )
    const cumpleBusqueda = textoProducto.includes(textoBuscado)

    const cumpleCategoria =
      filtros.categorias.length === 0 || filtros.categorias.includes(producto.categoria)

    const estado = producto.disponible ? 'disponible' : 'agotado'
    const cumpleDisponibilidad =
      filtros.disponibilidad.length === 0 || filtros.disponibilidad.includes(estado)

    const cumplePrecio =
      producto.precio >= filtros.precioMinimo && producto.precio <= filtros.precioMaximo

    return cumpleBusqueda && cumpleCategoria && cumpleDisponibilidad && cumplePrecio
  })
}
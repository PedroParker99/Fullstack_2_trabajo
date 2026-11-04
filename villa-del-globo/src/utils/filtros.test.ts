import { describe, it, expect } from 'vitest'
import type { Filtros } from '../models/Filtros'
import type { Producto } from '../models/Producto'
import { alternar, filtrarProductos, ordenarProductos } from './filtros'

// Datos de prueba propios: no dependen del catálogo real,
// así las pruebas no se rompen si mañana cambia productoService.
const productos: Producto[] = [
  {
    id: 1,
    nombre: 'Set Bluey',
    descripcion: 'Decoración completa',
    precio: 18990,
    imagen: '',
    tematica: 'Bluey',
    categoria: 'Set Decoración',
    disponible: true,
  },
  {
    id: 2,
    nombre: 'Globos Minecraft',
    descripcion: 'Globos metalizados',
    precio: 4990,
    imagen: '',
    tematica: 'Minecraft',
    categoria: 'Globos',
    disponible: true,
  },
  {
    id: 3,
    nombre: 'Velas Merlina',
    descripcion: 'Velas de cumpleaños',
    precio: 2490,
    imagen: '',
    tematica: 'Merlina',
    categoria: 'Accesorios',
    disponible: false,
  },
]

const sinFiltros: Filtros = {
  categorias: [],
  disponibilidad: [],
  precioMinimo: 0,
  precioMaximo: 20000,
}

// Devuelve solo los id, para comparar resultados de forma simple.
const ids = (lista: Producto[]) => lista.map((p) => p.id)

describe('alternar', () => {
  it('agrega el valor si no está en la lista', () => {
    expect(alternar(['Globos'], 'Manteles')).toEqual(['Globos', 'Manteles'])
  })

  it('quita el valor si ya está en la lista', () => {
    expect(alternar(['Globos', 'Manteles'], 'Globos')).toEqual(['Manteles'])
  })
})

describe('filtrarProductos', () => {
  it('sin búsqueda ni filtros devuelve todos los productos', () => {
    expect(filtrarProductos(productos, '', sinFiltros)).toHaveLength(3)
  })

  it('busca sin importar mayúsculas ni tildes', () => {
    expect(ids(filtrarProductos(productos, 'DECORACION', sinFiltros))).toEqual([1])
  })

  it('filtra por categoría', () => {
    const filtros: Filtros = { ...sinFiltros, categorias: ['Globos'] }
    expect(ids(filtrarProductos(productos, '', filtros))).toEqual([2])
  })

  it('filtra los productos agotados', () => {
    const filtros: Filtros = { ...sinFiltros, disponibilidad: ['agotado'] }
    expect(ids(filtrarProductos(productos, '', filtros))).toEqual([3])
  })

  it('filtra por rango de precio', () => {
    const filtros: Filtros = { ...sinFiltros, precioMinimo: 3000, precioMaximo: 10000 }
    expect(ids(filtrarProductos(productos, '', filtros))).toEqual([2])
  })
})

describe('ordenarProductos', () => {
  it('ordena por precio de menor a mayor', () => {
    expect(ids(ordenarProductos(productos, 'precio-asc'))).toEqual([3, 2, 1])
  })

  it('ordena por nombre alfabéticamente', () => {
    expect(ids(ordenarProductos(productos, 'nombre'))).toEqual([2, 1, 3])
  })

  it('no modifica la lista original', () => {
    ordenarProductos(productos, 'precio-desc')
    expect(ids(productos)).toEqual([1, 2, 3])
  })
})
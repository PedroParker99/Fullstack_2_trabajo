import { describe, it, expect } from 'vitest'
import type { ItemCarrito } from '../models/ItemCarrito'
import type { Producto } from '../models/Producto'
import {
  agregarProducto,
  calcularTotal,
  cambiarCantidad,
  contarItems,
  quitarProducto,
} from './carritoService'

const globos: Producto = {
  id: 1,
  nombre: 'Globos Bluey',
  descripcion: '',
  precio: 5000,
  imagen: '',
  tematica: 'Bluey',
  categoria: 'Globos',
  disponible: true,
}

const mantel: Producto = {
  id: 2,
  nombre: 'Mantel Frozen',
  descripcion: '',
  precio: 3000,
  imagen: '',
  tematica: 'Frozen',
  categoria: 'Manteles',
  disponible: true,
}

describe('carritoService', () => {
  it('agrega un producto nuevo con cantidad 1', () => {
    const items = agregarProducto([], globos)
    expect(items).toEqual([{ producto: globos, cantidad: 1 }])
  })

  it('si el producto ya está, suma 1 a la cantidad en vez de repetirlo', () => {
    const items = agregarProducto(agregarProducto([], globos), globos)
    expect(items).toHaveLength(1)
    expect(items[0].cantidad).toBe(2)
  })

  it('quita un producto por su id', () => {
    const items: ItemCarrito[] = [
      { producto: globos, cantidad: 1 },
      { producto: mantel, cantidad: 1 },
    ]
    expect(quitarProducto(items, 1)).toEqual([{ producto: mantel, cantidad: 1 }])
  })

  it('cambiar la cantidad a 0 elimina el producto', () => {
    const items: ItemCarrito[] = [{ producto: globos, cantidad: 3 }]
    expect(cambiarCantidad(items, 1, 0)).toEqual([])
  })

  it('calcula el total y la cantidad de artículos', () => {
    const items: ItemCarrito[] = [
      { producto: globos, cantidad: 2 }, // 2 x 5000 = 10000
      { producto: mantel, cantidad: 1 }, // 1 x 3000 =  3000
    ]
    expect(calcularTotal(items)).toBe(13000)
    expect(contarItems(items)).toBe(3)
  })

  it('no modifica el carrito original al agregar', () => {
    const original: ItemCarrito[] = [{ producto: globos, cantidad: 1 }]
    agregarProducto(original, globos)
    expect(original[0].cantidad).toBe(1)
  })
})
import { describe, it, expect } from 'vitest'
import { formatearPrecio } from './formato'

describe('formatearPrecio', () => {
  it('agrega el signo $ y el punto de miles', () => {
    // Preparar
    const precio = 19990

    // Ejecutar
    const resultado = formatearPrecio(precio)

    // Comprobar
    expect(resultado).toBe('$19.990')
  })

  it('formatea precios menores a mil sin punto', () => {
    expect(formatearPrecio(990)).toBe('$990')
  })

  it('formatea el cero como $0', () => {
    expect(formatearPrecio(0)).toBe('$0')
  })

  it('formatea millones con dos puntos', () => {
    expect(formatearPrecio(1250000)).toBe('$1.250.000')
  })
})
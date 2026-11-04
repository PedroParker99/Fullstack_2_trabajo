import { describe, it, expect } from 'vitest'
import { crearSlug, normalizarTexto } from './texto'

describe('normalizarTexto', () => {
  it('pasa el texto a minúsculas', () => {
    expect(normalizarTexto('BLUEY')).toBe('bluey')
  })

  it('quita las tildes y la ñ', () => {
    expect(normalizarTexto('Piñata Decoración')).toBe('pinata decoracion')
  })
})

describe('crearSlug', () => {
  it('cambia los espacios por guiones', () => {
    expect(crearSlug('Mario Bros')).toBe('mario-bros')
  })

  it('quita símbolos y no deja guiones repetidos ni en los extremos', () => {
    expect(crearSlug('  Guerreras K-pop!! ')).toBe('guerreras-k-pop')
  })
})
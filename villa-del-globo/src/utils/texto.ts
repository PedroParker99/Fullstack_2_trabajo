// Pasa el texto a minúsculas y le quita las tildes,
// para que "pinata" encuentre "Piñata" y "decoracion" encuentre "Decoración".
export const normalizarTexto = (texto: string): string =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

// Convierte un nombre en un texto apto para URL.
// Ejemplo: "Guerreras K-pop" -> "guerreras-k-pop", "Mario Bros" -> "mario-bros".
export const crearSlug = (texto: string): string =>
  normalizarTexto(texto)
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
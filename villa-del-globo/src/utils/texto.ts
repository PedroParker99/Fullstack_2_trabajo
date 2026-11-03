// Pasa el texto a minúsculas y le quita las tildes,
// para que "pinata" encuentre "Piñata" y "decoracion" encuentre "Decoración".
export const normalizarTexto = (texto: string): string =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
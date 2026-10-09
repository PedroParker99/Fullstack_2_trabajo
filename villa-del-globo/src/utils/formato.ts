export const formatearPrecio = (valor: number): string =>
  `$${valor.toLocaleString('es-CL')}`
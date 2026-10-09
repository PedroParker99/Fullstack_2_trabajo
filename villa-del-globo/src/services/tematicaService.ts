import type { TematicaDestacada } from '../models/TematicaDestacada'

const tematicas: TematicaDestacada[] = [
  {
    id: 1,
    nombre: 'Bluey',
    descripcion:
      'Todo lo que necesitas para una fiesta con la temática favorita de los más pequeños. Descubre nuestros productos relacionados:',
    imagen: '/img/Bluey.jpg',
    ruta: '#',
    color: 'primary',
    imagenIzquierda: true,
    articulos: ['Set decoración', 'Globos', 'Mantel', 'Vasos', 'Piñata', 'Corona'],
  },
  {
    id: 2,
    nombre: 'Minecraft',
    descripcion:
      'Construye la fiesta perfecta para los amantes de este mundo de bloques. Todo lo que necesitas en un solo lugar:',
    imagen: '/img/Minecraft.jpg',
    ruta: '#',
    color: 'success',
    imagenIzquierda: false,
    articulos: ['Set decoración', 'Cajas sorpresa', 'Corona', 'Globos', 'Mantel', 'Vasos'],
  },
]

export const obtenerTematicasDestacadas = (): TematicaDestacada[] => tematicas
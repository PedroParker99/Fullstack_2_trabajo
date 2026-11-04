import type { TematicaDestacada } from '../models/TematicaDestacada'
import { crearSlug } from '../utils/texto'

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

// Temáticas del mega-menú "Nuestra tienda", en 3 columnas.
const tematicasMenu: string[][] = [
  ['Among Us', 'Baby Shark', 'Barbie', 'Bluey', 'Bob Esponja', 'Cars', 'Cinnamonroll', 'Circo Digital'],
  ['Dragon Ball', 'Dinosaurio', 'FNAF', 'Frozen', 'Guerreras K-pop', 'Hello Kitty', 'Intensamente', 'Kuromi'],
  ['Mario Bros', 'Masha', 'Merlina', 'Mickey Mouse', 'Minecraft', 'Minions', 'Minnie Mouse'],
]

export const obtenerTematicasDestacadas = (): TematicaDestacada[] => tematicas

export const obtenerTematicasMenu = (): string[][] => tematicasMenu

// Recibe el slug de la URL ("mario-bros") y devuelve el nombre ("Mario Bros").
// Si no existe esa temática, devuelve undefined.
export const buscarTematicaPorSlug = (slug: string): string | undefined =>
  tematicasMenu.flat().find((nombre) => crearSlug(nombre) === slug)
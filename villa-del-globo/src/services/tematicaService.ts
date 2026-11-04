import type { TematicaDestacada } from '../models/TematicaDestacada'
import { crearSlug } from '../utils/texto'

const tematicas: TematicaDestacada[] = [
  {
    id: 1,
    nombre: 'Bluey',
    descripcion:
      'Todo lo que necesitas para una fiesta con la temática favorita de los más pequeños. Descubre nuestros productos relacionados:',
    imagen: '/img/Bluey.jpg',
    ruta: '/coleccion/bluey',
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
    ruta: '/coleccion/minecraft',
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

// Textos propios de algunas temáticas (los de bluey.html y minecraft.html).
interface EncabezadoTematica {
  emoji: string
  descripcion: string
}

const encabezados: Record<string, EncabezadoTematica> = {
  Bluey: {
    emoji: '🐾',
    descripcion: 'Todo lo que necesitas para organizar la fiesta perfecta de Bluey y Bingo.',
  },
  Minecraft: {
    emoji: '⛏️',
    descripcion: 'Construye la mejor fiesta pixeleada con Steve, Creepers y TNT.',
  },
}

export const obtenerTematicasDestacadas = (): TematicaDestacada[] => tematicas

export const obtenerTematicasMenu = (): string[][] => tematicasMenu

// Recibe el slug de la URL ("mario-bros") y devuelve el nombre ("Mario Bros").
// Si no existe esa temática, devuelve undefined.
export const buscarTematicaPorSlug = (slug: string): string | undefined =>
  tematicasMenu.flat().find((nombre) => crearSlug(nombre) === slug)

// Devuelve el encabezado propio de la temática o uno genérico si no tiene.
export const obtenerEncabezadoTematica = (nombre: string): EncabezadoTematica =>
  encabezados[nombre] ?? {
    emoji: '🎈',
    descripcion: `Todo lo que necesitas para organizar la fiesta perfecta de ${nombre}.`,
  }
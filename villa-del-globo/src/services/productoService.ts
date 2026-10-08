import type { Producto } from '../models/Producto'

const productos: Producto[] = [
  {
    id: 1,
    nombre: 'Set decoración cumpleaños Toy Story',
    precio: 19990,
    precioAnterior: 29990,
    imagen: '/img/SETTOYSTORY2.webp',
    tematica: 'Toy Story',
    disponible: true,
  },
  {
    id: 2,
    nombre: 'Set decoración cumpleaños Merlina',
    precio: 19990,
    precioAnterior: 24990,
    imagen: '/img/SETMERLINA.webp',
    tematica: 'Merlina',
    disponible: false,
  },
  {
    id: 3,
    nombre: 'Set decoración cumpleaños Masha y el Oso',
    precio: 19990,
    precioAnterior: 26990,
    imagen: '/img/SETMASHA.webp',
    tematica: 'Masha y el Oso',
    disponible: true,
  },
  {
    id: 4,
    nombre: 'Bolsas de dulces Minnie Mouse x6',
    precio: 5390,
    imagen: '/img/Bolsas_Minnie.webp',
    tematica: 'Minnie Mouse',
    disponible: true,
  },
]

export const obtenerProductos = (): Producto[] => productos
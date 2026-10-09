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
  {
    id: 5,
    nombre: 'Mantel Spiderman',
    precio: 3990,
    precioAnterior: 4990,
    imagen: '/img/spiderman_mantel.webp',
    tematica: 'Spiderman',
    disponible: true,
  },
  {
    id: 6,
    nombre: 'Mantel Frozen',
    precio: 3990,
    precioAnterior: 4990,
    imagen: '/img/frozen_mantel.webp',
    tematica: 'Frozen',
    disponible: true,
  },
  {
    id: 7,
    nombre: 'Set Mario Bros',
    precio: 19990,
    precioAnterior: 24990,
    imagen: '/img/SETMARIO.webp',
    tematica: 'Mario Bros',
    disponible: true,
  },
  {
    id: 8,
    nombre: 'Corona Minecraft',
    precio: 3990,
    precioAnterior: 4990,
    imagen: '/img/minecraft_corona.webp',
    tematica: 'Minecraft',
    disponible: true,
  },

]

export const obtenerProductos = (): Producto[] => productos
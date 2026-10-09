import type { Categoria } from '../models/Categoria'

const categorias: Categoria[] = [
  { id: 1, nombre: 'Bluey', imagen: '/img/Bluey.jpg', ruta: '#' },
  { id: 2, nombre: 'Frozen', imagen: '/img/Frozen.jpg', ruta: '#' },
  { id: 3, nombre: 'Mario Bros', imagen: '/img/Mario.jpg', ruta: '#' },
  { id: 4, nombre: 'Merlina', imagen: '/img/Merlina.jpg', ruta: '#' },
  { id: 5, nombre: 'Barbie', imagen: '/img/Barbie.jpg', ruta: '#' },
  { id: 6, nombre: 'Spiderman', imagen: '/img/Spiderman.jpg', ruta: '#' },
]

export const obtenerCategorias = (): Categoria[] => categorias
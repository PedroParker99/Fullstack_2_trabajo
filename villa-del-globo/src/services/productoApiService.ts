import type { Categoria, Producto } from '../models/Producto'
import type { ProductoApi } from '../models/ProductoApi'
import { apiProductos } from './api'

const categoriasValidas: Categoria[] = [
    'Set Decoración',
    'Globos',
    'Manteles',
    'Vasos y Vajilla',
    'Piñatas',
    'Accesorios',
]

export const convertirProducto = (api: ProductoApi): Producto => ({
    id: api.id,
    nombre: api.nombre,
    descripcion: api.descripcion ?? '',
    precio: api.precio,
    imagen: api.imagenUrl ?? '/img/Villa_del_Globo_Mark.avif',
    tematica: api.tematica ?? '',
    categoria: categoriasValidas.includes(api.categoria as Categoria)
        ? (api.categoria as Categoria)
        : 'Accesorios',
    disponible: api.stock > 0,
})

export const obtenerProductosApi = async (): Promise<Producto[]> => {
    const respuesta = await apiProductos.get<ProductoApi[]>('/productos')
    return respuesta.data.map(convertirProducto)
}
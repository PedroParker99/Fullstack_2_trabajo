import type { Categoria, Producto } from '../models/Producto'
import type { Inventario } from '../models/Inventario'
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
// ---------- Administración (panel admin) ----------

// GET /api/productos, tal como vienen del backend (sin adaptar)
export const obtenerProductosBackend = async (): Promise<ProductoApi[]> => {
  const respuesta = await apiProductos.get<ProductoApi[]>('/productos')
  return respuesta.data
}

// PUT /api/productos/{id}  (nombre, descripción, precio, categoría, imagen)
export const actualizarProductoApi = async (producto: ProductoApi): Promise<ProductoApi> => {
  const respuesta = await apiProductos.put<ProductoApi>(`/productos/${producto.id}`, producto)
  return respuesta.data
}

// GET /api/inventarios
export const obtenerInventarios = async (): Promise<Inventario[]> => {
  const respuesta = await apiProductos.get<Inventario[]>('/inventarios')
  return respuesta.data
}

// PUT /api/inventarios/{id}  (cambia el stock; ms_producto sincroniza el stock del producto)
export const actualizarInventario = async (inventario: Inventario): Promise<Inventario> => {
  const respuesta = await apiProductos.put<Inventario>(`/inventarios/${inventario.id}`, inventario)
  return respuesta.data
}

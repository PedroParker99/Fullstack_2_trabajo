export interface ProductoApi {
    id: number
    nombre: string
    descripcion: string | null
    precio: number
    stock: number
    imagenUrl: string | null
    categoria: string | null
    tematica: string | null
}
export interface TematicaDestacada {
  id: number
  nombre: string
  descripcion: string
  imagen: string
  ruta: string
  color: 'primary' | 'success'
  imagenIzquierda: boolean
  articulos: string[]
}
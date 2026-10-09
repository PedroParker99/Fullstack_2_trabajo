import type { ItemMenu } from '../models/ItemMenu'

const itemsAdmin: ItemMenu[] = [
  { id: 'dashboard', etiqueta: 'Dashboard', icono: 'bi-speedometer2' },
  { id: 'pedidos', etiqueta: 'Pedidos', icono: 'bi-box-seam' },
  { id: 'productos', etiqueta: 'Productos', icono: 'bi-bag' },
  { id: 'clientes', etiqueta: 'Clientes', icono: 'bi-people' },
  { id: 'descuentos', etiqueta: 'Descuentos', icono: 'bi-tag' },
  { id: 'informes', etiqueta: 'Informes', icono: 'bi-bar-chart' },
]

export const obtenerItemsAdmin = (): ItemMenu[] => itemsAdmin
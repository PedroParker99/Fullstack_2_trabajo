import type { Producto } from "../models/Producto";
import type { ItemCarrito } from "../models/ItemCarrito";

export function agregarProducto(
  items: ItemCarrito[],
  producto: Producto
): ItemCarrito[] {
  const existe = items.some((item) => item.producto.id === producto.id);

  if (existe) {
    return items.map((item) =>
      item.producto.id === producto.id
        ? { ...item, cantidad: item.cantidad + 1 }
        : item
    );
  }

  return [...items, { producto, cantidad: 1 }];
}

export function quitarProducto(
  items: ItemCarrito[],
  idProducto: number
): ItemCarrito[] {
  return items.filter((item) => item.producto.id !== idProducto);
}

export function cambiarCantidad(
  items: ItemCarrito[],
  idProducto: number,
  cantidad: number
): ItemCarrito[] {
  if (cantidad <= 0) {
    return quitarProducto(items, idProducto);
  }

  return items.map((item) =>
    item.producto.id === idProducto ? { ...item, cantidad } : item
  );
}

export function calcularTotal(items: ItemCarrito[]): number {
  return items.reduce(
    (acumulado, item) => acumulado + item.producto.precio * item.cantidad,
    0
  );
}

export function contarItems(items: ItemCarrito[]): number {
  return items.reduce((acumulado, item) => acumulado + item.cantidad, 0);
}

const CLAVE_CARRITO = "villa-del-globo-carrito";

export function cargarCarrito(): ItemCarrito[] {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    return guardado ? (JSON.parse(guardado) as ItemCarrito[]) : [];
  } catch {
    return [];
  }
}

export function guardarCarrito(items: ItemCarrito[]): void {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  } catch {
    // Si el navegador bloquea el almacenamiento, el carrito sigue funcionando en memoria
  }
}
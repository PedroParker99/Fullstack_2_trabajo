import { createContext } from "react";
import type { Producto } from "../models/Producto";
import type { ItemCarrito } from "../models/ItemCarrito";

export interface CarritoContextType {
  items: ItemCarrito[];
  total: number;
  cantidadTotal: number;
  agregar: (producto: Producto) => void;
  quitar: (idProducto: number) => void;
  cambiarCantidad: (idProducto: number, cantidad: number) => void;
  vaciar: () => void;
}

export const CarritoContext = createContext<CarritoContextType | undefined>(
  undefined
);
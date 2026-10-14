import { useEffect, useState, type ReactNode } from "react";
import type { Producto } from "../models/Producto";
import type { ItemCarrito } from "../models/ItemCarrito";
import * as servicio from "../services/carritoService";
import { CarritoContext } from "./CarritoContext";

interface CarritoProviderProps {
  children: ReactNode;
}

export function CarritoProvider({ children }: CarritoProviderProps) {
  const [items, setItems] = useState<ItemCarrito[]>(() =>
    servicio.cargarCarrito()
  );

  useEffect(() => {
    servicio.guardarCarrito(items);
  }, [items]);

  const agregar = (producto: Producto) => {
    setItems((actual) => servicio.agregarProducto(actual, producto));
  };

  const quitar = (idProducto: number) => {
    setItems((actual) => servicio.quitarProducto(actual, idProducto));
  };

  const cambiarCantidad = (idProducto: number, cantidad: number) => {
    setItems((actual) =>
      servicio.cambiarCantidad(actual, idProducto, cantidad)
    );
  };

  const vaciar = () => setItems([]);

  return (
    <CarritoContext.Provider
      value={{
        items,
        total: servicio.calcularTotal(items),
        cantidadTotal: servicio.contarItems(items),
        agregar,
        quitar,
        cambiarCantidad,
        vaciar,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
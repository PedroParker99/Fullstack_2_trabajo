// Forma en que ms_pedido devuelve un producto de un pedido (entidad DetallePedido.java).
export interface DetallePedido {
    id: number
    pedidoId: number
    productoId: number
    cantidad: number
    precioUnitario: number
    subtotal: number
}
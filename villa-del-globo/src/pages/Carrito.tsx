import { useCarrito } from '../hooks/useCarrito'
import { formatearPrecio } from '../utils/formato'

function Carrito() {
  const { items, total, cambiarCantidad, quitar, vaciar } = useCarrito()

  if (items.length === 0) {
    return (
      <main className="container py-5 text-center">
        <h1 className="h3 mb-3">Tu carrito está vacío</h1>
        <p className="text-muted">Agrega productos para verlos aquí.</p>
      </main>
    )
  }

  return (
    <main className="container py-5">
      <h1 className="h3 mb-4">Tu carrito</h1>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ producto, cantidad }) => (
              <tr key={producto.id}>
                <td>
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    width={60}
                    className="rounded me-3"
                  />
                  {producto.nombre}
                </td>
                <td>{formatearPrecio(producto.precio)}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      aria-label="Disminuir cantidad"
                      onClick={() => cambiarCantidad(producto.id, cantidad - 1)}
                    >
                      −
                    </button>
                    <span>{cantidad}</span>
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      aria-label="Aumentar cantidad"
                      onClick={() => cambiarCantidad(producto.id, cantidad + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td>{formatearPrecio(producto.precio * cantidad)}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    aria-label={`Quitar ${producto.nombre}`}
                    onClick={() => quitar(producto.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={vaciar}>
          Vaciar carrito
        </button>
        <p className="h4 mb-0">Total: {formatearPrecio(total)}</p>
      </div>
    </main>
  )
}

export default Carrito
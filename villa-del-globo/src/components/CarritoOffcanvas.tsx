import { useCarrito } from '../hooks/useCarrito'
import { formatearPrecio } from '../utils/formato'

function CarritoOffcanvas() {
    const { items, total, cambiarCantidad, quitar } = useCarrito()

    return (
        <div
            className="offcanvas offcanvas-end"
            tabIndex={-1}
            id="offcanvasCarrito"
            aria-labelledby="tituloCarrito"
        >
            <div className="offcanvas-header">
                <h5 className="offcanvas-title fw-bold" id="tituloCarrito">
                    <i className="bi bi-bag me-2"></i>
                    Mi carrito
                </h5>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Cerrar"
                ></button>
            </div>

            <div className="offcanvas-body d-flex flex-column">
                {items.length === 0 ? (
                    <p className="text-muted">Tu carrito está vacío.</p>
                ) : (
                    <ul className="list-unstyled mb-0">
                        {items.map(({ producto, cantidad }) => (
                            <li
                                key={producto.id}
                                className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3"
                            >
                                <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    width={64}
                                    height={64}
                                    className="rounded object-fit-cover"
                                />

                                <div className="flex-grow-1">
                                    <p className="mb-1 small fw-semibold">{producto.nombre}</p>
                                    <p className="mb-2 small text-muted">
                                        {formatearPrecio(producto.precio)}
                                    </p>

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
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    aria-label={`Quitar ${producto.nombre}`}
                                    onClick={() => quitar(producto.id)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="border-top pt-3 mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">Total</span>
                        <strong className="fs-5">{formatearPrecio(total)}</strong>
                    </div>

                    <button
                        type="button"
                        className="btn btn-rosa w-100 mt-3"
                        disabled={items.length === 0}
                    >
                        Finalizar compra
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CarritoOffcanvas
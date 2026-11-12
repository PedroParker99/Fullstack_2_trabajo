import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { useCarrito } from '../hooks/useCarrito'
import { useDatosApi } from '../hooks/useDatosApi'
import { useSesion } from '../hooks/useSesion'
import type { Pedido } from '../models/Pedido'
import { obtenerDireccionesUsuario } from '../services/direccionService'
import { crearPedido } from '../services/pedidoService'
import { obtenerMensajeError } from '../utils/errores'
import { formatearPrecio } from '../utils/formato'

function Checkout() {
  const { items, total, vaciar } = useCarrito()
  const { usuario } = useSesion()
  const usuarioId = usuario?.id ?? null

  // useCallback: la función solo cambia si cambia el usuario,
  // así useDatosApi no vuelve a pedir las direcciones en cada render.
  const cargarDirecciones = useCallback(
    () => (usuarioId ? obtenerDireccionesUsuario(usuarioId) : Promise.resolve([])),
    [usuarioId]
  )
  const direcciones = useDatosApi(cargarDirecciones, [])

  const [direccionElegida, setDireccionElegida] = useState<number | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pedidoCreado, setPedidoCreado] = useState<Pedido | null>(null)

  // Si el usuario aún no elige, se usa la dirección predeterminada (o la primera).
  const predeterminada = direcciones.datos.find((d) => d.predeterminada) ?? direcciones.datos[0]
  const direccionId = direccionElegida ?? predeterminada?.id ?? null

  const confirmarPedido = async () => {
    if (direccionId === null || usuarioId === null) return

    setEnviando(true)
    setError(null)

    try {
      const pedido = await crearPedido(usuarioId, direccionId, items)
      setPedidoCreado(pedido)
      vaciar()
    } catch (e) {
      setError(obtenerMensajeError(e))
    } finally {
      setEnviando(false)
    }
  }

  // 1) Pedido confirmado
  if (pedidoCreado) {
    return (
      <main className="container py-5">
        <div className="bg-white rounded-4 shadow-sm p-5 text-center">
          <i className="bi bi-check-circle-fill text-success display-4"></i>
          <h1 className="fw-bold mt-3">¡Pedido #{pedidoCreado.id} confirmado! 🎈</h1>
          <p className="text-muted mb-1">Total: {formatearPrecio(pedidoCreado.total)}</p>
          <p className="text-muted">Se enviará a: {pedidoCreado.direccionEntrega}</p>
          <Link to="/coleccion" className="btn btn-rosa mt-3">
            Seguir comprando
          </Link>
        </div>
      </main>
    )
  }

  // 2) Carrito vacío
  if (items.length === 0) {
    return (
      <main className="container py-5">
        <div className="bg-white rounded-4 shadow-sm p-5 text-center">
          <i className="bi bi-bag fs-1 text-muted"></i>
          <h1 className="fw-bold mt-3">Tu carrito está vacío</h1>
          <Link to="/coleccion" className="btn btn-rosa mt-3">
            Ver colección
          </Link>
        </div>
      </main>
    )
  }

  // 3) Sin sesión: hay que ingresar para comprar
  if (!usuario) {
    return (
      <main className="container py-5">
        <div className="bg-white rounded-4 shadow-sm p-5 text-center">
          <i className="bi bi-person-lock fs-1 text-muted"></i>
          <h1 className="fw-bold mt-3">Inicia sesión para comprar</h1>
          <p className="text-muted">Tu carrito se mantiene guardado.</p>
          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-3">
            <Link to="/ingresar" className="btn btn-rosa">
              Iniciar sesión
            </Link>
            <Link to="/registro" className="btn btn-outline-secondary">
              Crear cuenta
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // 4) Formulario de compra
  return (
    <main className="container py-5">
      <div className="bg-white rounded-4 shadow-sm p-4">
        <h1 className="fw-bold mb-4">Finalizar compra</h1>

        <div className="row g-4">
          {/* Dirección de entrega (ms_direccion) */}
          <section className="col-lg-7">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-geo-alt me-2"></i>
              Dirección de entrega
            </h5>

            {direcciones.cargando && (
              <div className="spinner-border text-rosa" role="status"></div>
            )}

            {direcciones.error && (
              <div className="alert alert-danger">{direcciones.error}</div>
            )}

            {!direcciones.cargando && !direcciones.error && direcciones.datos.length === 0 && (
              <p className="text-muted">No tienes direcciones registradas.</p>
            )}

            {direcciones.datos.map((d) => (
              <label
                key={d.id}
                className={`card p-3 mb-3 ${direccionId === d.id ? 'border-rosa border-2' : ''}`}
                htmlFor={`direccion-${d.id}`}
              >
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="direccion"
                    id={`direccion-${d.id}`}
                    checked={direccionId === d.id}
                    onChange={() => setDireccionElegida(d.id)}
                  />
                  <span className="fw-semibold">
                    {d.calle} {d.numero}
                    {d.departamento ? `, ${d.departamento}` : ''}
                  </span>
                  {d.predeterminada && (
                    <span className="badge bg-rosa ms-2">Predeterminada</span>
                  )}
                  <div className="small text-muted">
                    {d.comuna}, {d.ciudad}, {d.region}
                  </div>
                </div>
              </label>
            ))}
          </section>

          {/* Resumen del carrito */}
          <section className="col-lg-5">
            <div className="border rounded-4 p-4">
              <h5 className="fw-bold mb-3">Resumen del pedido</h5>

              <ul className="list-unstyled mb-3">
                {items.map(({ producto, cantidad }) => (
                  <li key={producto.id} className="d-flex justify-content-between small mb-2">
                    <span>
                      {producto.nombre} × {cantidad}
                    </span>
                    <span>{formatearPrecio(producto.precio * cantidad)}</span>
                  </li>
                ))}
              </ul>

              <div className="d-flex justify-content-between border-top pt-3">
                <span className="fw-semibold">Total</span>
                <strong className="fs-5">{formatearPrecio(total)}</strong>
              </div>

              {error && (
                <div className="alert alert-danger mt-3 mb-0" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <button
                type="button"
                className="btn btn-rosa w-100 mt-3"
                disabled={direccionId === null || enviando}
                onClick={confirmarPedido}
              >
                {enviando ? 'Procesando...' : 'Confirmar pedido'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Checkout
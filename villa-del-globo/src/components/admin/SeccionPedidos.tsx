import { Fragment, useState } from 'react'
import { useDatosApi } from '../../hooks/useDatosApi'
import type { DetallePedido } from '../../models/DetallePedido'
import type { Pedido } from '../../models/Pedido'
import { cambiarEstadoPedido, obtenerDetallesPedido, obtenerPedidos } from '../../services/pedidoService'
import { obtenerProductosBackend } from '../../services/productoApiService'
import { obtenerUsuarios } from '../../services/usuarioService'
import { obtenerMensajeError } from '../../utils/errores'
import { formatearPrecio } from '../../utils/formato'

const colorEstado: Record<string, string> = {
  PENDIENTE: 'bg-warning text-dark',
  CONFIRMADO: 'bg-primary',
  EN_PREPARACION: 'bg-primary',
  ENVIADO: 'bg-info text-dark',
  ENTREGADO: 'bg-success',
  CANCELADO: 'bg-danger',
}

// Sección "Pedidos" del admin (como adminPedidos.html):
// ver detalle, marcar como enviado / entregado y cancelar.
function SeccionPedidos() {
  const pedidos = useDatosApi(obtenerPedidos, [])
  const usuarios = useDatosApi(obtenerUsuarios, [])
  const productos = useDatosApi(obtenerProductosBackend, [])

  const [abierto, setAbierto] = useState<number | null>(null)
  const [detalles, setDetalles] = useState<DetallePedido[]>([])
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'danger'; texto: string } | null>(null)

  const nombreCliente = (usuarioId: number) => {
    const u = usuarios.datos.find((x) => x.id === usuarioId)
    return u ? `${u.nombre} ${u.apellido}` : `Usuario #${usuarioId}`
  }

  const nombreProducto = (productoId: number) =>
    productos.datos.find((p) => p.id === productoId)?.nombre ?? `Producto #${productoId}`

  const verDetalle = async (pedido: Pedido) => {
    if (abierto === pedido.id) {
      setAbierto(null)
      return
    }
    try {
      setDetalles(await obtenerDetallesPedido(pedido.id))
      setAbierto(pedido.id)
    } catch (e) {
      setMensaje({ tipo: 'danger', texto: obtenerMensajeError(e) })
    }
  }

  const cambiarEstado = async (pedido: Pedido, estado: string) => {
    setMensaje(null)
    try {
      await cambiarEstadoPedido(pedido.id, estado)
      setMensaje({ tipo: 'success', texto: `Pedido #${pedido.id} actualizado a ${estado}.` })
      pedidos.recargar()
    } catch (e) {
      setMensaje({ tipo: 'danger', texto: obtenerMensajeError(e) })
    }
  }

  const cargando = pedidos.cargando || usuarios.cargando
  const error = pedidos.error ?? usuarios.error

  return (
    <>
      <h1 className="fw-bold mb-1">Pedidos</h1>
      <p className="text-muted mb-4">
        Pedidos de ms_pedido (puerto 8083), con los clientes de ms_usuario.
      </p>

      {mensaje && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {cargando && <div className="spinner-border text-rosa" role="status"></div>}

      {!cargando && !error && (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>N° Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.datos.map((p) => {
                  const puedeEnviar = ['PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION'].includes(p.estado)
                  const puedeEntregar = p.estado === 'ENVIADO'
                  const puedeCancelar = puedeEnviar

                  return (
                    <Fragment key={p.id}>
                      <tr>
                        <td className="fw-semibold">#{p.id}</td>
                        <td>{nombreCliente(p.usuarioId)}</td>
                        <td>{new Date(p.fechaPedido).toLocaleString('es-CL')}</td>
                        <td>{formatearPrecio(p.total)}</td>
                        <td>
                          <span className={`badge ${colorEstado[p.estado] ?? 'bg-secondary'}`}>{p.estado}</span>
                        </td>
                        <td className="text-end">
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-outline-secondary dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              data-bs-popper-config='{"strategy":"fixed"}'
                            >
                              Acciones
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button className="dropdown-item" type="button" onClick={() => verDetalle(p)}>
                                  <i className="bi bi-eye me-2"></i>
                                  {abierto === p.id ? 'Ocultar detalle' : 'Ver detalle'}
                                </button>
                              </li>
                              {puedeEnviar && (
                                <li>
                                  <button className="dropdown-item" type="button" onClick={() => cambiarEstado(p, 'ENVIADO')}>
                                    <i className="bi bi-truck me-2"></i>Marcar como enviado
                                  </button>
                                </li>
                              )}
                              {puedeEntregar && (
                                <li>
                                  <button className="dropdown-item" type="button" onClick={() => cambiarEstado(p, 'ENTREGADO')}>
                                    <i className="bi bi-check2-circle me-2"></i>Marcar como entregado
                                  </button>
                                </li>
                              )}
                              {puedeCancelar && (
                                <>
                                  <li><hr className="dropdown-divider" /></li>
                                  <li>
                                    <button className="dropdown-item text-danger" type="button" onClick={() => cambiarEstado(p, 'CANCELADO')}>
                                      <i className="bi bi-x-circle me-2"></i>Cancelar pedido
                                    </button>
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>
                        </td>
                      </tr>

                      {/* Detalle del pedido (productos) */}
                      {abierto === p.id && (
                        <tr className="table-light">
                          <td colSpan={6}>
                            <p className="small mb-2">
                              <i className="bi bi-geo-alt me-1"></i>
                              {p.direccionEntrega}
                            </p>
                            <ul className="list-unstyled small mb-0">
                              {detalles.map((d) => (
                                <li key={d.id} className="d-flex justify-content-between border-bottom py-1">
                                  <span>{nombreProducto(d.productoId)} × {d.cantidad}</span>
                                  <span>{formatearPrecio(d.subtotal)}</span>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
            {pedidos.datos.length === 0 && (
              <p className="text-center text-muted py-4 mb-0">Todavía no hay pedidos.</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default SeccionPedidos
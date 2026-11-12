import { Fragment, useState } from 'react'
import { useDatosApi } from '../../hooks/useDatosApi'
import type { Pedido } from '../../models/Pedido'
import type { Usuario } from '../../models/Usuario'
import { obtenerPedidosUsuario } from '../../services/pedidoService'
import { actualizarUsuario, obtenerUsuarios } from '../../services/usuarioService'
import { obtenerMensajeError } from '../../utils/errores'
import { formatearPrecio } from '../../utils/formato'
import FormularioDatos from '../perfil/FormularioDatos'

// Sección "Clientes" del admin (como adminClientes.html):
// ver pedidos del cliente y editar sus datos en ms_usuario.
function SeccionClientes() {
  const usuarios = useDatosApi(obtenerUsuarios, [])

  const [editando, setEditando] = useState<number | null>(null)
  const [verPedidosDe, setVerPedidosDe] = useState<number | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'danger'; texto: string } | null>(null)

  const guardar = async (datos: Usuario) => {
    setGuardando(true)
    setMensaje(null)
    try {
      await actualizarUsuario(datos)
      setEditando(null)
      setMensaje({ tipo: 'success', texto: `Se actualizaron los datos de ${datos.nombre} ${datos.apellido}.` })
      usuarios.recargar()
    } catch (e) {
      setMensaje({ tipo: 'danger', texto: obtenerMensajeError(e) })
    } finally {
      setGuardando(false)
    }
  }

  const mostrarPedidos = async (u: Usuario) => {
    setEditando(null)
    if (verPedidosDe === u.id) {
      setVerPedidosDe(null)
      return
    }
    try {
      setPedidos(await obtenerPedidosUsuario(u.id))
      setVerPedidosDe(u.id)
    } catch (e) {
      setMensaje({ tipo: 'danger', texto: obtenerMensajeError(e) })
    }
  }

  return (
    <>
      <h1 className="fw-bold mb-1">Clientes</h1>
      <p className="text-muted mb-4">Usuarios registrados en ms_usuario.</p>

      {mensaje && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}
      {usuarios.error && <div className="alert alert-danger">{usuarios.error}</div>}
      {usuarios.cargando && <div className="spinner-border text-rosa" role="status"></div>}

      {!usuarios.cargando && !usuarios.error && (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Correo Electrónico</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.datos.map((u) => (
                  <Fragment key={u.id}>
                    <tr>
                      <td>{u.id}</td>
                      <td className="fw-semibold">{u.nombre} {u.apellido}</td>
                      <td>{u.correo}</td>
                      <td>{u.telefono}</td>
                      <td>
                        <span className={`badge ${u.rol === 'ADMIN' ? 'bg-dark' : 'bg-rosa'}`}>{u.rol}</span>
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
                              <button className="dropdown-item" type="button" onClick={() => mostrarPedidos(u)}>
                                <i className="bi bi-bag-check me-2"></i>
                                {verPedidosDe === u.id ? 'Ocultar pedidos' : 'Ver pedidos'}
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => {
                                  setVerPedidosDe(null)
                                  setEditando(u.id)
                                }}
                              >
                                <i className="bi bi-pencil me-2"></i>Editar datos
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>

                    {editando === u.id && (
                      <tr className="table-light">
                        <td colSpan={6} className="p-3">
                          <FormularioDatos
                            usuario={u}
                            guardando={guardando}
                            onGuardar={guardar}
                            onCancelar={() => setEditando(null)}
                          />
                        </td>
                      </tr>
                    )}

                    {verPedidosDe === u.id && (
                      <tr className="table-light">
                        <td colSpan={6}>
                          {pedidos.length === 0 ? (
                            <p className="small text-muted mb-0">Este cliente no tiene pedidos.</p>
                          ) : (
                            <ul className="list-unstyled small mb-0">
                              {pedidos.map((p) => (
                                <li key={p.id} className="d-flex justify-content-between border-bottom py-1">
                                  <span>Pedido #{p.id} · {new Date(p.fechaPedido).toLocaleDateString('es-CL')} · {p.estado}</span>
                                  <span>{formatearPrecio(p.total)}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

export default SeccionClientes
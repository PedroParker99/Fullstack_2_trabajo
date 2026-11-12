import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { useDatosApi } from '../hooks/useDatosApi'
import { useSesion } from '../hooks/useSesion'
import { obtenerDireccionesUsuario } from '../services/direccionService'
import { obtenerPedidosUsuario } from '../services/pedidoService'
import { formatearPrecio } from '../utils/formato'

type Seccion = 'perfil' | 'compras' | 'direcciones'

const colorEstado: Record<string, string> = {
  PENDIENTE: 'bg-warning text-dark',
  ENVIADO: 'bg-info text-dark',
  COMPLETADO: 'bg-success',
  CANCELADO: 'bg-danger',
}

function Perfil() {
  const { usuario, cerrarSesion } = useSesion()
  const [seccion, setSeccion] = useState<Seccion>('perfil')
  const usuarioId = usuario?.id ?? null

  // Pedidos del usuario (ms_pedido) y sus direcciones (ms_direccion)
  const cargarPedidos = useCallback(
    () => (usuarioId ? obtenerPedidosUsuario(usuarioId) : Promise.resolve([])),
    [usuarioId]
  )
  const cargarDirecciones = useCallback(
    () => (usuarioId ? obtenerDireccionesUsuario(usuarioId) : Promise.resolve([])),
    [usuarioId]
  )
  const pedidos = useDatosApi(cargarPedidos, [])
  const direcciones = useDatosApi(cargarDirecciones, [])

  if (!usuario) {
    return (
      <main className="container py-5">
        <div className="bg-white rounded-4 shadow-sm p-5 text-center">
          <i className="bi bi-person-lock fs-1 text-muted"></i>
          <h1 className="fw-bold mt-3">Inicia sesión para ver tu cuenta</h1>
          <Link to="/ingresar" className="btn btn-rosa mt-3">
            Iniciar sesión
          </Link>
        </div>
      </main>
    )
  }

  const itemMenu = (id: Seccion, icono: string, texto: string) => (
    <button
      type="button"
      className={`perfil-menu-item w-100 border-0 bg-transparent text-start ${seccion === id ? 'active' : ''}`}
      onClick={() => setSeccion(id)}
    >
      <i className={`bi ${icono}`}></i>
      {texto}
    </button>
  )

  return (
    <main className="container py-5">
      <div className="cuenta-panel bg-white rounded-4 shadow-sm overflow-hidden">
        {/* Encabezado */}
        <header className="p-4 p-lg-5 border-bottom">
          <span className="text-rosa small fw-semibold">MI CUENTA</span>
          <h1 className="fw-bold mt-2 mb-1">Hola, {usuario.nombre}</h1>
          <p className="text-muted mb-0">Administra tu información, compras y preferencias.</p>
        </header>

        <div className="row g-0">
          {/* Menú lateral */}
          <aside className="col-lg-3 border-end">
            <nav className="p-3 p-lg-4">
              {itemMenu('perfil', 'bi-person', 'Mi perfil')}
              {itemMenu('compras', 'bi-box-seam', 'Mis compras')}
              {itemMenu('direcciones', 'bi-geo-alt', 'Mis direcciones')}
              <hr className="my-3" />
              <button
                type="button"
                className="perfil-menu-item w-100 border-0 bg-transparent text-start text-danger"
                onClick={cerrarSesion}
              >
                <i className="bi bi-box-arrow-right"></i>
                Cerrar sesión
              </button>
            </nav>
          </aside>

          {/* Contenido */}
          <section className="col-lg-9">
            <div className="p-4 p-lg-5">
              {seccion === 'perfil' && (
                <>
                  <h3 className="fw-bold mb-1">Información personal</h3>
                  <p className="text-muted mb-4">Datos principales de tu cuenta (ms_usuario)</p>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <small className="text-muted">Nombre</small>
                      <p className="fw-semibold mb-0">{usuario.nombre} {usuario.apellido}</p>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted">Correo electrónico</small>
                      <p className="fw-semibold mb-0">{usuario.correo}</p>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted">Teléfono</small>
                      <p className="fw-semibold mb-0">{usuario.telefono}</p>
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted">Tipo de cuenta</small>
                      <p className="mb-0"><span className="badge bg-rosa">{usuario.rol}</span></p>
                    </div>
                  </div>
                </>
              )}

              {seccion === 'compras' && (
                <>
                  <h3 className="fw-bold mb-1">Mis compras</h3>
                  <p className="text-muted mb-4">Historial de pedidos (ms_pedido)</p>
                  {pedidos.cargando && <div className="spinner-border text-rosa" role="status"></div>}
                  {pedidos.error && <div className="alert alert-danger">{pedidos.error}</div>}
                  {!pedidos.cargando && !pedidos.error && pedidos.datos.length === 0 && (
                    <p className="text-muted">Todavía no tienes compras.</p>
                  )}
                  {pedidos.datos.map((p) => (
                    <div key={p.id} className="border rounded-4 p-3 mb-3">
                      <div className="d-flex flex-wrap justify-content-between gap-2">
                        <strong>Pedido #{p.id}</strong>
                        <span className={`badge ${colorEstado[p.estado] ?? 'bg-secondary'}`}>{p.estado}</span>
                      </div>
                      <p className="small text-muted mb-1">
                        {new Date(p.fechaPedido).toLocaleString('es-CL')}
                      </p>
                      <p className="small mb-1">
                        <i className="bi bi-geo-alt me-1"></i>
                        {p.direccionEntrega}
                      </p>
                      <p className="fw-bold mb-0">{formatearPrecio(p.total)}</p>
                    </div>
                  ))}
                </>
              )}

              {seccion === 'direcciones' && (
                <>
                  <h3 className="fw-bold mb-1">Mis direcciones</h3>
                  <p className="text-muted mb-4">Direcciones de entrega (ms_direccion)</p>
                  {direcciones.cargando && <div className="spinner-border text-rosa" role="status"></div>}
                  {direcciones.error && <div className="alert alert-danger">{direcciones.error}</div>}
                  {!direcciones.cargando && !direcciones.error && direcciones.datos.length === 0 && (
                    <p className="text-muted">No tienes direcciones registradas.</p>
                  )}
                  {direcciones.datos.map((d) => (
                    <div key={d.id} className="border rounded-4 p-3 mb-3">
                      <strong>
                        {d.calle} {d.numero}
                        {d.departamento ? `, ${d.departamento}` : ''}
                      </strong>
                      {d.predeterminada && <span className="badge bg-rosa ms-2">Predeterminada</span>}
                      <p className="small text-muted mb-0">
                        {d.comuna}, {d.ciudad}, {d.region}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Perfil

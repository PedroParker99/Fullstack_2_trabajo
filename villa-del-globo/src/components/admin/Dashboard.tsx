import { Link } from 'react-router'
import { useDatosApi } from '../../hooks/useDatosApi'
import { useSesion } from '../../hooks/useSesion'
import { obtenerPedidos } from '../../services/pedidoService'
import { obtenerInventarios, obtenerProductosBackend } from '../../services/productoApiService'
import { obtenerUsuarios } from '../../services/usuarioService'
import { formatearPrecio } from '../../utils/formato'

interface DashboardProps {
  onIr: (seccion: string) => void
}

const colorEstado: Record<string, string> = {
  PENDIENTE: 'bg-warning text-dark',
  ENVIADO: 'bg-info text-dark',
  COMPLETADO: 'bg-success',
  CANCELADO: 'bg-danger',
}

// Resumen del panel admin (igual a perfilAdmin.html), con datos reales
// de ms_pedido, ms_producto y ms_usuario.
function Dashboard({ onIr }: DashboardProps) {
  const { usuario } = useSesion()
  const pedidos = useDatosApi(obtenerPedidos, [])
  const usuarios = useDatosApi(obtenerUsuarios, [])
  const productos = useDatosApi(obtenerProductosBackend, [])
  const inventarios = useDatosApi(obtenerInventarios, [])

  const totalVentas = pedidos.datos
    .filter((p) => p.estado !== 'CANCELADO')
    .reduce((suma, p) => suma + p.total, 0)
  const pendientes = pedidos.datos.filter((p) => p.estado === 'PENDIENTE').length
  const clientes = usuarios.datos.filter((u) => u.rol === 'CLIENTE').length

  // Stock crítico: inventarios en o bajo su stock mínimo
  const criticos = inventarios.datos
    .filter((i) => i.cantidadDisponible <= i.stockMinimo)
    .map((i) => ({ ...i, producto: productos.datos.find((p) => p.id === i.productoId) }))

  const ultimosPedidos = [...pedidos.datos].sort((a, b) => b.id - a.id).slice(0, 5)

  const nombreCliente = (usuarioId: number) => {
    const u = usuarios.datos.find((x) => x.id === usuarioId)
    return u ? `${u.nombre} ${u.apellido}` : `Usuario #${usuarioId}`
  }

  const error = pedidos.error ?? usuarios.error ?? productos.error ?? inventarios.error

  const tarjeta = (titulo: string, valor: string, icono: string, color: string, detalle: string) => (
    <div className="col-sm-6 col-xl-3">
      <div className={`card border-0 shadow-sm h-100 border-start border-${color} border-4`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted small fw-bold">{titulo}</span>
            <i className={`bi ${icono} text-${color} fs-4`}></i>
          </div>
          <h3 className="card-title fw-bold mb-1">{valor}</h3>
          <span className="small text-muted">{detalle}</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Encabezado */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="mb-1">¡Hola, {usuario?.nombre ?? 'Administrador'}! 👋</h1>
          <p className="text-muted mb-0">Resumen operativo y estado general de Villa del Globo.</p>
        </div>
        <Link to="/" className="btn btn-outline-primary">
          <i className="bi bi-shop me-1"></i>Ver Tienda
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* KPIs */}
      <div className="row g-3 mb-4">
        {tarjeta('VENTAS TOTALES', formatearPrecio(totalVentas), 'bi-currency-dollar', 'primary', `${pedidos.datos.length} pedidos realizados`)}
        {tarjeta('POR PREPARAR', String(pendientes), 'bi-clock-history', 'warning', 'Pedidos pendientes')}
        {tarjeta('STOCK CRÍTICO', String(criticos.length), 'bi-exclamation-triangle', 'danger', 'Productos con poco stock')}
        {tarjeta('CLIENTES', String(clientes), 'bi-person-check', 'success', 'Registrados en la tienda')}
      </div>

      {/* Acciones rápidas */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title fs-6 fw-bold mb-3">
            <i className="bi bi-lightning-charge me-2"></i>Acciones Rápidas
          </h5>
          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-light border" onClick={() => onIr('productos')}>
              <i className="bi bi-pencil-square me-1 text-primary"></i>Editar Productos
            </button>
            <button type="button" className="btn btn-light border" onClick={() => onIr('pedidos')}>
              <i className="bi bi-box-seam me-1 text-warning"></i>Gestionar Pedidos
            </button>
            <button type="button" className="btn btn-light border" onClick={() => onIr('clientes')}>
              <i className="bi bi-people me-1 text-success"></i>Ver Clientes
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Últimos pedidos */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0 fs-6 fw-bold">
                <i className="bi bi-bag-check me-2"></i>Últimos Pedidos
              </h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha/Hora</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimosPedidos.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-semibold">#{p.id}</td>
                      <td>{nombreCliente(p.usuarioId)}</td>
                      <td>{new Date(p.fechaPedido).toLocaleString('es-CL')}</td>
                      <td>{formatearPrecio(p.total)}</td>
                      <td>
                        <span className={`badge ${colorEstado[p.estado] ?? 'bg-secondary'}`}>{p.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ultimosPedidos.length === 0 && (
                <p className="text-center text-muted py-4 mb-0">Todavía no hay pedidos.</p>
              )}
            </div>
          </div>
        </div>

        {/* Stock crítico */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h5 className="card-title mb-0 fs-6 fw-bold">
                <i className="bi bi-exclamation-circle text-danger me-2"></i>Stock Crítico
              </h5>
            </div>
            <ul className="list-group list-group-flush">
              {criticos.map((c) => (
                <li key={c.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                  <div>
                    <h6 className="mb-0 fs-6">{c.producto?.nombre ?? `Producto #${c.productoId}`}</h6>
                    <small className="text-muted">Categoría: {c.producto?.categoria ?? '-'}</small>
                  </div>
                  <span className={`badge rounded-pill ${c.cantidadDisponible === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                    {c.cantidadDisponible} unid.
                  </span>
                </li>
              ))}
              {criticos.length === 0 && (
                <li className="list-group-item text-muted small py-3">Sin productos en stock crítico.</li>
              )}
            </ul>
            <div className="card-footer bg-white text-center py-2">
              <button type="button" className="btn btn-link btn-sm text-decoration-none" onClick={() => onIr('productos')}>
                Ir a Inventario de Productos
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard

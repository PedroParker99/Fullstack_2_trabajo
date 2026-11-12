import { useDatosApi } from '../../hooks/useDatosApi'
import { obtenerPedidos } from '../../services/pedidoService'
import { obtenerUsuarios } from '../../services/usuarioService'
import TablaPedidos from './TablaPedidos'

// Sección "Pedidos" del panel admin.
// Combina datos de DOS microservicios: los pedidos (ms_pedido)
// y los nombres de los clientes (ms_usuario).
function SeccionPedidos() {
  const pedidos = useDatosApi(obtenerPedidos, [])
  const usuarios = useDatosApi(obtenerUsuarios, [])

  const cargando = pedidos.cargando || usuarios.cargando
  const error = pedidos.error ?? usuarios.error

  return (
    <>
      <h1 className="fw-bold mb-1">Pedidos</h1>
      <p className="text-muted mb-4">
        Pedidos de ms_pedido (puerto 8083), con los clientes de ms_usuario (puerto 8082).
      </p>

      {cargando && (
        <div className="text-center py-5">
          <div className="spinner-border text-rosa" role="status"></div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {!cargando && !error && (
        <TablaPedidos pedidos={pedidos.datos} usuarios={usuarios.datos} />
      )}
    </>
  )
}

export default SeccionPedidos
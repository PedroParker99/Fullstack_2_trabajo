import type { Pedido } from '../../models/Pedido'
import type { Usuario } from '../../models/Usuario'
import { formatearPrecio } from '../../utils/formato'

interface TablaPedidosProps {
  pedidos: Pedido[]
  usuarios: Usuario[]
}

// Color del badge según el estado del pedido (igual que adminPedidos.html).
const colorEstado: Record<string, string> = {
  PENDIENTE: 'bg-warning text-dark',
  ENVIADO: 'bg-info text-dark',
  COMPLETADO: 'bg-success',
  CANCELADO: 'bg-danger',
}

function TablaPedidos({ pedidos, usuarios }: TablaPedidosProps) {
  // Busca el nombre del cliente en los datos de ms_usuario.
  const nombreCliente = (usuarioId: number) => {
    const usuario = usuarios.find((u) => u.id === usuarioId)
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : `Usuario #${usuarioId}`
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>N° Pedido</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Dirección de entrega</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td className="fw-semibold">#{p.id}</td>
              <td>{nombreCliente(p.usuarioId)}</td>
              <td>{new Date(p.fechaPedido).toLocaleString('es-CL')}</td>
              <td className="small">{p.direccionEntrega}</td>
              <td>{formatearPrecio(p.total)}</td>
              <td>
                <span className={`badge ${colorEstado[p.estado] ?? 'bg-secondary'}`}>
                  {p.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pedidos.length === 0 && (
        <p className="text-center text-muted py-4">Todavía no hay pedidos.</p>
      )}
    </div>
  )
}

export default TablaPedidos
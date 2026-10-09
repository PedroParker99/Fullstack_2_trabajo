import type { Producto } from '../../models/Producto'
import { formatearPrecio } from '../../utils/formato'

interface TablaProductosProps {
  productos: Producto[]
  onEliminar: (id: Producto['id']) => void
}

function TablaProductos({ productos, onEliminar }: TablaProductosProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Temática</th>
            <th>Precio</th>
            <th>Estado</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>
                <img src={p.imagen} alt={p.nombre} width={50} className="rounded" />
              </td>
              <td>{p.nombre}</td>
              <td>{p.tematica}</td>
              <td>{formatearPrecio(p.precio)}</td>
              <td>
                <span className={`badge ${p.disponible ? 'bg-success' : 'bg-secondary'}`}>
                  {p.disponible ? 'Disponible' : 'Agotado'}
                </span>
              </td>
              <td className="text-end">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onEliminar(p.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {productos.length === 0 && (
        <p className="text-center text-muted py-4">No hay productos.</p>
      )}
    </div>
  )
}

export default TablaProductos
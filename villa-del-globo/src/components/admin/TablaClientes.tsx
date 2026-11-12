import type { Usuario } from '../../models/Usuario'

interface TablaClientesProps {
  usuarios: Usuario[]
}

function TablaClientes({ usuarios }: TablaClientesProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td className="fw-semibold">
                {u.nombre} {u.apellido}
              </td>
              <td>{u.correo}</td>
              <td>{u.telefono}</td>
              <td>
                <span className={`badge ${u.rol === 'ADMIN' ? 'bg-dark' : 'bg-rosa'}`}>
                  {u.rol}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {usuarios.length === 0 && (
        <p className="text-center text-muted py-4">No hay clientes registrados.</p>
      )}
    </div>
  )
}

export default TablaClientes
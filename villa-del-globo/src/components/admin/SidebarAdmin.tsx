import type { ItemMenu } from '../../models/ItemMenu'

interface SidebarAdminProps {
  items: ItemMenu[]
  activo: string
  onSeleccionar: (id: string) => void
  onSalir: () => void
}

function SidebarAdmin({ items, activo, onSeleccionar, onSalir }: SidebarAdminProps) {
  return (
    <aside className="sidebar-admin d-flex flex-column flex-shrink-0 p-3 bg-dark text-white">
      <h5 className="fw-bold mb-3">🎈 Panel Admin</h5>

      <ul className="nav nav-pills flex-md-column gap-1">
        {items.map((item) => (
          <li className="nav-item" key={item.id}>
            <button
              type="button"
              className={`nav-link text-start ${item.id === activo ? 'active bg-rosa' : 'text-white'
                }`}
              onClick={() => onSeleccionar(item.id)}
            >
              <i className={`bi ${item.icono} me-2`}></i>
              {item.etiqueta}
            </button>
          </li>
        ))}
      </ul>

      <hr className="border-secondary" />
      <button type="button" className="nav-link text-start text-danger" onClick={onSalir}>
        <i className="bi bi-box-arrow-right me-2"></i>
        Cerrar sesión
      </button>
    </aside>
  )
}

export default SidebarAdmin
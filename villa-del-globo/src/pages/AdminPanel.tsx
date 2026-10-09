import { useState } from 'react'
import SidebarAdmin from '../components/admin/SidebarAdmin'
import { obtenerItemsAdmin } from '../services/adminService'

function AdminPanel() {
  const items = obtenerItemsAdmin()
  const [activo, setActivo] = useState('dashboard')

  return (
    <div className="d-flex">
      <SidebarAdmin items={items} activo={activo} onSeleccionar={setActivo} />

      <main className="flex-grow-1 p-4">
        <h1 className="fw-bold">{activo}</h1>
        <p className="text-muted">Aquí irá el contenido de la sección.</p>
      </main>
    </div>
  )
}

export default AdminPanel
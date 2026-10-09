import { useState } from 'react'
import SidebarAdmin from '../components/admin/SidebarAdmin'
import TablaProductos from '../components/admin/TablaProductos'
import type { Producto } from '../models/Producto'
import { obtenerItemsAdmin } from '../services/adminService'
import { obtenerProductos } from '../services/productoService'

function AdminPanel() {
  const items = obtenerItemsAdmin()
  const [activo, setActivo] = useState('dashboard')
  const [productos, setProductos] = useState<Producto[]>(obtenerProductos())

  const eliminarProducto = (id: Producto['id']) => {
    setProductos((actuales) => actuales.filter((p) => p.id !== id))
  }

  return (
    <div className="d-flex">
      <SidebarAdmin items={items} activo={activo} onSeleccionar={setActivo} />

      <main className="flex-grow-1 p-4">
        {activo === 'productos' ? (
          <>
            <h1 className="fw-bold mb-4">Productos</h1>
            <TablaProductos productos={productos} onEliminar={eliminarProducto} />
          </>
        ) : (
          <>
            <h1 className="fw-bold">{activo}</h1>
            <p className="text-muted">Aquí irá el contenido de la sección.</p>
          </>
        )}
      </main>
    </div>
  )
}

export default AdminPanel
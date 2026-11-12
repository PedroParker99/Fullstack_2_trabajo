import { useState } from 'react'
import { useNavigate } from 'react-router'
import Dashboard from '../components/admin/Dashboard'
import SeccionClientes from '../components/admin/SeccionClientes'
import SeccionPedidos from '../components/admin/SeccionPedidos'
import SeccionProductos from '../components/admin/SeccionProductos'
import SidebarAdmin from '../components/admin/SidebarAdmin'
import { useSesion } from '../hooks/useSesion'
import { obtenerItemsAdmin } from '../services/adminService'

function AdminPanel() {
  const items = obtenerItemsAdmin()
  const [activo, setActivo] = useState('dashboard')
  const { cerrarSesion } = useSesion()
  const navigate = useNavigate()

  // Cierra la sesión del admin y vuelve a la página de inicio
  const salir = () => {
    cerrarSesion()
    navigate('/')
  }

  return (
    <div className="d-flex flex-column flex-md-row">
      <SidebarAdmin items={items} activo={activo} onSeleccionar={setActivo} onSalir={salir} />

      <main className="flex-grow-1 p-4 bg-light">
        {activo === 'dashboard' ? (
          <Dashboard onIr={setActivo} />
        ) : activo === 'productos' ? (
          <SeccionProductos />
        ) : activo === 'clientes' ? (
          <SeccionClientes />
        ) : activo === 'pedidos' ? (
          <SeccionPedidos />
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

import { useDatosApi } from '../../hooks/useDatosApi'
import { obtenerUsuarios } from '../../services/usuarioService'
import TablaClientes from './TablaClientes'

// Sección "Clientes" del panel admin: muestra los usuarios de ms_usuario.
function SeccionClientes() {
  const { datos: usuarios, cargando, error } = useDatosApi(obtenerUsuarios, [])

  return (
    <>
      <h1 className="fw-bold mb-1">Clientes</h1>
      <p className="text-muted mb-4">Usuarios registrados en ms_usuario (puerto 8082).</p>

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

      {!cargando && !error && <TablaClientes usuarios={usuarios} />}
    </>
  )
}

export default SeccionClientes
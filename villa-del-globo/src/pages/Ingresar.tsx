import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useSesion } from '../hooks/useSesion'
import { buscarUsuarioPorCorreo } from '../services/usuarioService'
import { obtenerMensajeError } from '../utils/errores'

function Ingresar() {
  const { iniciarSesion } = useSesion()
  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const enviar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    setEnviando(true)
    setError(null)

    try {
      const usuario = await buscarUsuarioPorCorreo(correo)

      if (!usuario) {
        setError('No encontramos una cuenta con ese correo.')
        return
      }

      iniciarSesion(usuario)
      navigate(usuario.rol === 'ADMIN' ? '/admin' : '/coleccion')
    } catch (e) {
      setError(obtenerMensajeError(e))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="container py-5">
      <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mx-auto" style={{ maxWidth: '480px' }}>
        <span className="text-rosa small fw-bold text-uppercase">Mi cuenta</span>
        <h1 className="fw-bold mt-2 mb-4">Iniciar sesión</h1>

        <form onSubmit={enviar}>
          <label htmlFor="correoIngreso" className="form-label">Correo electrónico</label>
          <input
            id="correoIngreso"
            type="email"
            className="form-control"
            placeholder="tucorreo@ejemplo.cl"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          {error && (
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-rosa w-100 mt-4" disabled={enviando}>
            {enviando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="text-center text-muted small mt-4 mb-0">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-rosa fw-semibold">
            Regístrate
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Ingresar

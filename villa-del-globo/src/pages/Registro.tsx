import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'
import type { Usuario } from '../models/Usuario'
import { crearUsuario } from '../services/usuarioService'
import type { NuevoUsuario } from '../services/usuarioService'
import { obtenerMensajeError } from '../utils/errores'

const formularioVacio: NuevoUsuario = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
}

function Registro() {
    const [formulario, setFormulario] = useState<NuevoUsuario>(formularioVacio)
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [usuarioCreado, setUsuarioCreado] = useState<Usuario | null>(null)

    // Un solo manejador para los 4 campos: usa el "name" del input.
    const cambiarCampo = (campo: keyof NuevoUsuario, valor: string) => {
        setFormulario((actual) => ({ ...actual, [campo]: valor }))
    }

    const enviar = async (evento: FormEvent<HTMLFormElement>) => {
        evento.preventDefault()

        // Validación en el frontend (la misma regla que Usuario.java)
        if (!/^[0-9]{9}$/.test(formulario.telefono)) {
            setError('El teléfono debe tener 9 dígitos, sin espacios ni +56.')
            return
        }

        setEnviando(true)
        setError(null)

        try {
            const usuario = await crearUsuario(formulario)
            setUsuarioCreado(usuario)
            setFormulario(formularioVacio)
        } catch (e) {
            setError(obtenerMensajeError(e))
        } finally {
            setEnviando(false)
        }
    }

    if (usuarioCreado) {
        return (
            <main className="container py-5">
                <div className="bg-white rounded-4 shadow-sm p-5 text-center mx-auto" style={{ maxWidth: '560px' }}>
                    <i className="bi bi-person-check-fill text-success display-4"></i>
                    <h1 className="fw-bold mt-3">¡Bienvenido/a, {usuarioCreado.nombre}! 🎈</h1>
                    <p className="text-muted">
                        Tu cuenta quedó registrada con el correo {usuarioCreado.correo}.
                    </p>
                    <Link to="/coleccion" className="btn btn-rosa mt-2">
                        Ir a la tienda
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="container py-5">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5 mx-auto" style={{ maxWidth: '560px' }}>
                <span className="text-rosa small fw-bold text-uppercase">Mi cuenta</span>
                <h1 className="fw-bold mt-2 mb-4">Crear cuenta</h1>

                <form onSubmit={enviar}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input
                                id="nombre"
                                className="form-control"
                                required
                                value={formulario.nombre}
                                onChange={(e) => cambiarCampo('nombre', e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label htmlFor="apellido" className="form-label">Apellido</label>
                            <input
                                id="apellido"
                                className="form-control"
                                required
                                value={formulario.apellido}
                                onChange={(e) => cambiarCampo('apellido', e.target.value)}
                            />
                        </div>

                        <div className="col-12">
                            <label htmlFor="correo" className="form-label">Correo electrónico</label>
                            <input
                                id="correo"
                                type="email"
                                className="form-control"
                                required
                                value={formulario.correo}
                                onChange={(e) => cambiarCampo('correo', e.target.value)}
                            />
                        </div>

                        <div className="col-12">
                            <label htmlFor="telefono" className="form-label">Teléfono</label>
                            <input
                                id="telefono"
                                type="tel"
                                className="form-control"
                                placeholder="912345678"
                                required
                                value={formulario.telefono}
                                onChange={(e) => cambiarCampo('telefono', e.target.value)}
                            />
                            <div className="form-text">9 dígitos, sin +56.</div>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger mt-4 mb-0" role="alert">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-rosa w-100 mt-4" disabled={enviando}>
                        {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>
            </div>
        </main>
    )
}

export default Registro
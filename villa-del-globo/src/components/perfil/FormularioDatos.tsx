import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Usuario } from '../../models/Usuario'

interface FormularioDatosProps {
  usuario: Usuario
  guardando: boolean
  onGuardar: (usuario: Usuario) => void
  onCancelar: () => void
}

// Formulario para editar nombre, apellido, correo y teléfono.
function FormularioDatos({ usuario, guardando, onGuardar, onCancelar }: FormularioDatosProps) {
  const [datos, setDatos] = useState<Usuario>(usuario)

  const cambiar = (campo: keyof Usuario, valor: string) => {
    setDatos((actual) => ({ ...actual, [campo]: valor }))
  }

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    onGuardar(datos)
  }

  return (
    <form onSubmit={enviar} className="row g-3">
      <div className="col-md-6">
        <label htmlFor="editNombre" className="form-label">Nombre</label>
        <input id="editNombre" className="form-control" required value={datos.nombre}
          onChange={(e) => cambiar('nombre', e.target.value)} />
      </div>
      <div className="col-md-6">
        <label htmlFor="editApellido" className="form-label">Apellido</label>
        <input id="editApellido" className="form-control" required value={datos.apellido}
          onChange={(e) => cambiar('apellido', e.target.value)} />
      </div>
      <div className="col-md-6">
        <label htmlFor="editCorreo" className="form-label">Correo electrónico</label>
        <input id="editCorreo" type="email" className="form-control" required value={datos.correo}
          onChange={(e) => cambiar('correo', e.target.value)} />
      </div>
      <div className="col-md-6">
        <label htmlFor="editTelefono" className="form-label">Teléfono</label>
        <input id="editTelefono" type="tel" className="form-control" required pattern="[0-9]{9}"
          title="9 dígitos, sin +56" value={datos.telefono}
          onChange={(e) => cambiar('telefono', e.target.value)} />
      </div>
      <div className="col-12 d-flex gap-2">
        <button type="submit" className="btn btn-rosa" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default FormularioDatos

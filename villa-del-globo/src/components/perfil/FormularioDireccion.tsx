import { useState } from 'react'
import type { FormEvent } from 'react'
import type { DatosDireccion } from '../../services/direccionService'

interface FormularioDireccionProps {
  inicial: DatosDireccion
  guardando: boolean
  onGuardar: (datos: DatosDireccion) => void
  onCancelar: () => void
}

// Formulario reutilizable: sirve para agregar y para editar una dirección.
function FormularioDireccion({ inicial, guardando, onGuardar, onCancelar }: FormularioDireccionProps) {
  const [datos, setDatos] = useState<DatosDireccion>(inicial)

  const cambiar = (campo: keyof DatosDireccion, valor: string) => {
    setDatos((actual) => ({ ...actual, [campo]: valor }))
  }

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    onGuardar(datos)
  }

  const campo = (id: keyof DatosDireccion, etiqueta: string, columnas: string, obligatorio = true) => (
    <div className={columnas}>
      <label htmlFor={`dir-${id}`} className="form-label small">{etiqueta}</label>
      <input
        id={`dir-${id}`}
        className="form-control form-control-sm"
        required={obligatorio}
        value={datos[id] ?? ''}
        onChange={(e) => cambiar(id, e.target.value)}
      />
    </div>
  )

  return (
    <form onSubmit={enviar} className="row g-2 border rounded-4 p-3 mb-3">
      {campo('calle', 'Calle', 'col-md-8')}
      {campo('numero', 'Número', 'col-md-4')}
      {campo('departamento', 'Departamento (opcional)', 'col-md-6', false)}
      {campo('comuna', 'Comuna', 'col-md-6')}
      {campo('ciudad', 'Ciudad', 'col-md-6')}
      {campo('region', 'Región', 'col-md-6')}
      {campo('referencia', 'Referencia (opcional)', 'col-12', false)}
      <div className="col-12 d-flex gap-2 mt-2">
        <button type="submit" className="btn btn-rosa btn-sm" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar dirección'}
        </button>
        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default FormularioDireccion

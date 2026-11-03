import type { Disponibilidad, Filtros } from '../models/Filtros'
import type { Categoria, Producto } from '../models/Producto'
import { alternar } from '../utils/filtros'
import { formatearPrecio } from '../utils/formato'

const categorias: Categoria[] = [
  'Set Decoración',
  'Globos',
  'Manteles',
  'Vasos y Vajilla',
  'Piñatas',
  'Accesorios',
]

interface FiltrosColeccionProps {
  productos: Producto[]
  filtros: Filtros
  precioTope: number
  onCambiar: (filtros: Filtros) => void
  onLimpiar: () => void
}

function FiltrosColeccion({ productos, filtros, precioTope, onCambiar, onLimpiar }: FiltrosColeccionProps) {
  const contarCategoria = (categoria: Categoria) =>
    productos.filter((p) => p.categoria === categoria).length

  const disponibles = productos.filter((p) => p.disponible).length
  const agotados = productos.length - disponibles

  const cambiarCategoria = (categoria: Categoria) => {
    onCambiar({ ...filtros, categorias: alternar(filtros.categorias, categoria) })
  }

  const cambiarDisponibilidad = (valor: Disponibilidad) => {
    onCambiar({ ...filtros, disponibilidad: alternar(filtros.disponibilidad, valor) })
  }

  return (
    <aside className="col-lg-3">
      <div className="pe-lg-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-sliders me-2"></i>
            Filtros
          </h5>

          <button
            type="button"
            className="btn btn-link btn-sm text-muted text-decoration-none p-0"
            onClick={onLimpiar}
          >
            Limpiar
          </button>
        </div>

        {/* Categoría de producto */}
        <div className="filtro-grupo">
          <button
            className="filtro-titulo"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#filtroCategoria"
            aria-expanded="true"
            aria-controls="filtroCategoria"
          >
            <span>Categoría</span>
            <i className="bi bi-chevron-up flecha"></i>
          </button>

          <div className="collapse show pt-3" id="filtroCategoria">
            {categorias.map((categoria, indice) => (
              <div className={`form-check ${indice < categorias.length - 1 ? 'mb-3' : ''}`} key={categoria}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`cat-${indice}`}
                  checked={filtros.categorias.includes(categoria)}
                  onChange={() => cambiarCategoria(categoria)}
                />
                <label className="form-check-label w-100 d-flex justify-content-between" htmlFor={`cat-${indice}`}>
                  <span>{categoria}</span>
                  <small className="text-muted">{contarCategoria(categoria)}</small>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Disponibilidad */}
        <div className="filtro-grupo">
          <button
            className="filtro-titulo"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#filtroDisponibilidad"
            aria-expanded="true"
            aria-controls="filtroDisponibilidad"
          >
            <span>Disponibilidad</span>
            <i className="bi bi-chevron-up flecha"></i>
          </button>

          <div className="collapse show pt-3" id="filtroDisponibilidad">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="disponible"
                checked={filtros.disponibilidad.includes('disponible')}
                onChange={() => cambiarDisponibilidad('disponible')}
              />
              <label className="form-check-label w-100 d-flex justify-content-between" htmlFor="disponible">
                <span>En existencia</span>
                <small className="text-muted">{disponibles}</small>
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="agotado"
                checked={filtros.disponibilidad.includes('agotado')}
                onChange={() => cambiarDisponibilidad('agotado')}
              />
              <label className="form-check-label w-100 d-flex justify-content-between" htmlFor="agotado">
                <span>Agotado</span>
                <small className="text-muted">{agotados}</small>
              </label>
            </div>
          </div>
        </div>

        {/* Precio */}
        <div className="filtro-grupo">
          <button
            className="filtro-titulo"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#filtroPrecio"
            aria-expanded="true"
            aria-controls="filtroPrecio"
          >
            <span>Precio</span>
            <i className="bi bi-chevron-up flecha"></i>
          </button>

          <div className="collapse show pt-3" id="filtroPrecio">
            <p className="small text-muted">Selecciona tu rango de precio.</p>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <label htmlFor="precioMinimo" className="form-label small text-muted">Mínimo</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    id="precioMinimo"
                    min={0}
                    max={precioTope}
                    value={filtros.precioMinimo}
                    onChange={(evento) => onCambiar({ ...filtros, precioMinimo: Number(evento.target.value) })}
                  />
                </div>
              </div>

              <div className="col-6">
                <label htmlFor="precioMaximo" className="form-label small text-muted">Máximo</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    id="precioMaximo"
                    min={0}
                    max={precioTope}
                    value={filtros.precioMaximo}
                    onChange={(evento) => onCambiar({ ...filtros, precioMaximo: Number(evento.target.value) })}
                  />
                </div>
              </div>
            </div>

            <input
              type="range"
              className="form-range"
              id="rangoPrecio"
              aria-label="Precio máximo"
              min={0}
              max={precioTope}
              step={100}
              value={filtros.precioMaximo}
              onChange={(evento) => onCambiar({ ...filtros, precioMaximo: Number(evento.target.value) })}
            />

            <div className="d-flex justify-content-between text-muted small">
              <span>$0</span>
              <span>{formatearPrecio(filtros.precioMaximo)}</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  )
}

export default FiltrosColeccion
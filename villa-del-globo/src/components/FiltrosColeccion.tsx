import type { Categoria, Producto } from '../models/Producto'

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
}

function FiltrosColeccion({ productos }: FiltrosColeccionProps) {
  const contarCategoria = (categoria: Categoria) =>
    productos.filter((p) => p.categoria === categoria).length

  const disponibles = productos.filter((p) => p.disponible).length
  const agotados = productos.length - disponibles

  return (
    <aside className="col-lg-3">
      <div className="pe-lg-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-sliders me-2"></i>
            Filtros
          </h5>

          <button type="button" className="btn btn-link btn-sm text-muted text-decoration-none p-0">
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
                <input className="form-check-input" type="checkbox" id={`cat-${indice}`} />
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
              <input className="form-check-input" type="checkbox" id="disponible" />
              <label className="form-check-label w-100 d-flex justify-content-between" htmlFor="disponible">
                <span>En existencia</span>
                <small className="text-muted">{disponibles}</small>
              </label>
            </div>

            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="agotado" />
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
                  <input type="number" className="form-control" id="precioMinimo" defaultValue={0} min={0} />
                </div>
              </div>

              <div className="col-6">
                <label htmlFor="precioMaximo" className="form-label small text-muted">Máximo</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text">$</span>
                  <input type="number" className="form-control" id="precioMaximo" defaultValue={19990} min={0} />
                </div>
              </div>
            </div>

            <input type="range" className="form-range" id="rangoPrecio" min={0} max={19990} defaultValue={19990} />

            <div className="d-flex justify-content-between text-muted small">
              <span>$0</span>
              <span>$19.990</span>
            </div>
          </div>
        </div>

      </div>
    </aside>
  )
}

export default FiltrosColeccion
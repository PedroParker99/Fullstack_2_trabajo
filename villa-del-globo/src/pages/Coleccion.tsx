import { Link } from 'react-router'
import FiltrosColeccion from '../components/FiltrosColeccion'
import TarjetaColeccion from '../components/TarjetaColeccion'
import { obtenerProductos } from '../services/productoService'

function Coleccion() {
  const productos = obtenerProductos()

  return (
    <main className="container py-5">
      <div className="bg-white rounded-4 shadow-sm p-4">

        {/* Encabezado */}
        <section className="pb-4 mb-4 border-bottom">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-3">
              <li className="breadcrumb-item">
                <Link to="/" className="text-rosa text-decoration-none">Inicio</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Colección Completa
              </li>
            </ol>
          </nav>

          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4">
            <div>
              <span className="text-rosa small fw-bold text-uppercase">Catálogo General</span>
              <h1 className="fw-bold mt-2 mb-2">Colección Completa de Cotillón y Decoración 🎈</h1>
              <p className="text-muted mb-0">
                Explora todos nuestros productos, packs temáticos, vajilla y globos en un solo lugar.
              </p>
            </div>

            {/* Ordenar */}
            <div className="input-group ordenar-productos">
              <span className="input-group-text bg-white">
                <i className="bi bi-sort-down me-2"></i>
                Ordenar por
              </span>
              <select className="form-select" aria-label="Ordenar productos" defaultValue="caracteristicas">
                <option value="caracteristicas">Características</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre</option>
              </select>
            </div>
          </div>
        </section>

        {/* Buscador de productos */}
        <div className="border-bottom pb-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <p className="text-muted mb-0">
              Mostrando <strong className="text-dark">{productos.length} productos</strong>
            </p>

            <div className="input-group buscador-packs" style={{ maxWidth: '380px' }}>
              <span className="input-group-text bg-white">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="search"
                className="form-control"
                placeholder="Buscar en el catálogo..."
                aria-label="Buscar productos"
              />
            </div>
          </div>
        </div>

        <div className="row g-4 align-items-start">
          <FiltrosColeccion productos={productos} />

          {/* Productos */}
          <section className="col-lg-9">
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
              {productos.map((producto) => (
                <div className="col producto-col" key={producto.id}>
                  <TarjetaColeccion producto={producto} />
                </div>
              ))}
            </div>
          </section>
        </div>

      </div>
    </main>
  )
}

export default Coleccion
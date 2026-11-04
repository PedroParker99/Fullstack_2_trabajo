import { useState } from 'react'
import { Link, useParams } from 'react-router'
import FiltrosColeccion from '../components/FiltrosColeccion'
import TarjetaColeccion from '../components/TarjetaColeccion'
import { obtenerProductos } from '../services/productoService'
import type { Filtros, OrdenProductos } from '../models/Filtros'
import { buscarTematicaPorSlug, obtenerEncabezadoTematica } from '../services/tematicaService'
import { filtrarProductos, ordenarProductos } from '../utils/filtros'
import { crearSlug } from '../utils/texto'
import NoEncontrada from './NoEncontrada'

// Página de la ruta: lee la URL y decide qué catálogo mostrar.
function Coleccion() {
  const { tematica } = useParams()

  // /coleccion/algo-que-no-existe -> 404
  if (tematica && !buscarTematicaPorSlug(tematica)) {
    return <NoEncontrada />
  }

  // key: al cambiar de temática, React crea un catálogo nuevo
  // y la búsqueda y los filtros vuelven a cero.
  return <CatalogoColeccion key={tematica ?? 'todas'} slugTematica={tematica} />
}

interface CatalogoColeccionProps {
  slugTematica?: string
}

function CatalogoColeccion({ slugTematica }: CatalogoColeccionProps) {
  const nombreTematica = slugTematica ? buscarTematicaPorSlug(slugTematica) : undefined
  const encabezado = nombreTematica ? obtenerEncabezadoTematica(nombreTematica) : undefined

  const todosLosProductos = obtenerProductos()
  const productos = slugTematica
    ? todosLosProductos.filter((p) => crearSlug(p.tematica).startsWith(slugTematica))
    : todosLosProductos

  const precioTope = Math.max(0, ...productos.map((p) => p.precio))

  const filtrosIniciales: Filtros = {
    categorias: [],
    disponibilidad: [],
    precioMinimo: 0,
    precioMaximo: precioTope,
  }

  const [busqueda, setBusqueda] = useState('')
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciales)
  const [orden, setOrden] = useState<OrdenProductos>('caracteristicas')

  const productosFiltrados = ordenarProductos(
    filtrarProductos(productos, busqueda, filtros),
    orden
  )

  const cantidad = productosFiltrados.length

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
                {nombreTematica ?? 'Colección Completa'}
              </li>
            </ol>
          </nav>

          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4">
            {nombreTematica && encabezado ? (
              <div>
                <span className="text-rosa small fw-bold text-uppercase">Temática destacada</span>
                <h1 className="fw-bold mt-2 mb-2">
                  Decoración y Cumpleaños {nombreTematica} {encabezado.emoji}
                </h1>
                <p className="text-muted mb-0">{encabezado.descripcion}</p>
              </div>
            ) : (
              <div>
                <span className="text-rosa small fw-bold text-uppercase">Catálogo General</span>
                <h1 className="fw-bold mt-2 mb-2">Colección Completa de Cotillón y Decoración 🎈</h1>
                <p className="text-muted mb-0">
                  Explora todos nuestros productos, packs temáticos, vajilla y globos en un solo lugar.
                </p>
              </div>
            )}

            {/* Ordenar */}
            <div className="input-group ordenar-productos">
              <span className="input-group-text bg-white">
                <i className="bi bi-sort-down me-2"></i>
                Ordenar por
              </span>
              <select
                className="form-select"
                aria-label="Ordenar productos"
                value={orden}
                onChange={(evento) => setOrden(evento.target.value as OrdenProductos)}
              >
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
              Mostrando{' '}
              <strong className="text-dark">
                {cantidad} {cantidad === 1 ? 'producto' : 'productos'}
              </strong>
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
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row g-4 align-items-start">
          <FiltrosColeccion
            productos={productos}
            filtros={filtros}
            precioTope={precioTope}
            onCambiar={setFiltros}
            onLimpiar={() => setFiltros(filtrosIniciales)}
          />

          {/* Productos */}
          <section className="col-lg-9">
            <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
              {productosFiltrados.map((producto) => (
                <div className="col producto-col" key={producto.id}>
                  <TarjetaColeccion producto={producto} />
                </div>
              ))}
            </div>

            {/* Sin resultados */}
            {cantidad === 0 && (
              <div className="text-center py-5">
                <i className="bi bi-search fs-1 text-muted"></i>
                <h5 className="fw-bold mt-3">No encontramos productos</h5>
                <p className="text-muted mb-0">
                  Prueba cambiando la búsqueda o los filtros.
                </p>
              </div>
            )}
          </section>
        </div>

      </div>
    </main>
  )
}

export default Coleccion
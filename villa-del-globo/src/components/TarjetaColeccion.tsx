import { useState } from 'react'
import type { Producto } from '../models/Producto'
import { useCarrito } from '../hooks/useCarrito'
import { formatearPrecio } from '../utils/formato'

interface TarjetaColeccionProps {
  producto: Producto
}

function TarjetaColeccion({ producto }: TarjetaColeccionProps) {
  const { nombre, descripcion, precio, imagen, tematica, categoria, disponible } = producto
  const { agregar } = useCarrito()
  const [esFavorito, setEsFavorito] = useState(false)

  return (
    <article className="card producto-card h-100 border-0 shadow-sm">
      <div className="producto-imagen">
        <img src={imagen} className="card-img-top" alt={nombre} />

        <span className="badge bg-rosa producto-badge">{tematica}</span>

        <button
          type="button"
          className={`btn btn-light rounded-circle btn-favorito shadow-sm ${esFavorito ? 'activo' : ''}`}
          aria-label={esFavorito ? `Quitar ${nombre} de favoritos` : `Agregar ${nombre} a favoritos`}
          onClick={() => setEsFavorito(!esFavorito)}
        >
          <i className={esFavorito ? 'bi bi-heart-fill' : 'bi bi-heart'}></i>
        </button>
      </div>

      <div className="card-body d-flex flex-column p-4">
        <small className="text-rosa fw-semibold mb-2">{categoria}</small>

        <h5 className="card-title fw-bold">{nombre}</h5>

        <p className="text-muted small">{descripcion}</p>

        <div className="mt-auto">
          {disponible ? (
            <p className="text-success small mb-2">
              <i className="bi bi-check-circle-fill me-1"></i>
              En existencia
            </p>
          ) : (
            <p className="text-danger small mb-2">
              <i className="bi bi-x-circle-fill me-1"></i>
              Agotado
            </p>
          )}

          <p className="fs-5 fw-bold mb-3">{formatearPrecio(precio)}</p>

          <button
            type="button"
            className="btn btn-rosa w-100"
            disabled={!disponible}
            onClick={() => agregar(producto)}
          >
            <i className="bi bi-bag-plus me-2"></i>
            {disponible ? 'Añadir al carrito' : 'Sin stock'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default TarjetaColeccion
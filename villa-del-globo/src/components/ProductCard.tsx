import type { Producto } from '../models/Producto'
import { formatearPrecio } from '../utils/formato'

interface ProductCardProps {
  producto: Producto
}

function ProductCard({ producto }: ProductCardProps) {
  const { nombre, precio, precioAnterior, imagen, disponible } = producto

  const descuento = precioAnterior
    ? Math.round(((precioAnterior - precio) / precioAnterior) * 100)
    : 0

  return (
    <article className="card h-100 card-producto producto-card shadow-sm">
      {descuento > 0 && (
        <span className="badge bg-danger position-absolute m-2">
          Ahorras {descuento}%
        </span>
      )}

      <img src={imagen} className="card-img-top" alt={nombre} />

      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{nombre}</h6>

        <p className="mb-3">
          {precioAnterior && (
            <span className="text-decoration-line-through text-muted">
              {formatearPrecio(precioAnterior)}
            </span>
          )}
          <span className={precioAnterior ? 'text-danger fw-bold ms-2 fs-5' : 'fw-bold fs-5'}>
            {formatearPrecio(precio)}
          </span>
        </p>

        {disponible ? (
          <button type="button" className="btn btn-rosa mt-auto">
            <i className="bi bi-bag-plus me-2"></i>
            Añadir al carrito
          </button>
        ) : (
          <button type="button" className="btn btn-secondary mt-auto" disabled>
            Agotado
          </button>
        )}
      </div>
    </article>
  )
}

export default ProductCard
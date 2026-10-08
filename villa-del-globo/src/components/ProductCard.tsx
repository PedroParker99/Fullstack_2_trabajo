import type { Producto } from '../models/Producto'

interface ProductCardProps {
  producto: Producto
}

const formatearPrecio = (valor: number): string =>
  `$${valor.toLocaleString('es-CL')}`

function ProductCard({ producto }: ProductCardProps) {
  const { nombre, precio, precioAnterior, imagen, disponible } = producto

  const descuento = precioAnterior
    ? Math.round(((precioAnterior - precio) / precioAnterior) * 100)
    : 0

  return (
    <article className="card h-100 shadow-sm">
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
            <span className="text-decoration-line-through text-muted me-2">
              {formatearPrecio(precioAnterior)}
            </span>
          )}
          <span className="fw-bold fs-5">{formatearPrecio(precio)}</span>
        </p>

        {disponible ? (
          <button type="button" className="btn btn-primary mt-auto">
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
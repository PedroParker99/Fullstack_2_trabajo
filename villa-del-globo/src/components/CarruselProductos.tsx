import type { Producto } from '../models/Producto'
import ProductCard from './ProductCard'

interface CarruselProductosProps {
  id: string
  productos: Producto[]
  porSlide?: number
}

function CarruselProductos({ id, productos, porSlide = 4 }: CarruselProductosProps) {
  const slides: Producto[][] = []
  for (let i = 0; i < productos.length; i += porSlide) {
    slides.push(productos.slice(i, i + porSlide))
  }

  return (
    <div id={id} className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {slides.map((grupo, indice) => (
          <div
            className={`carousel-item ${indice === 0 ? 'active' : ''}`}
            key={indice}
          >
            <div className="row g-4 px-5">
              {grupo.map((producto) => (
                <div className="col-6 col-lg-3" key={producto.id}>
                  <ProductCard producto={producto} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon bg-dark rounded-circle p-3"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon bg-dark rounded-circle p-3"></span>
      </button>
    </div>
  )
}

export default CarruselProductos
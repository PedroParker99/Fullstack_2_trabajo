import type { Producto } from '../models/Producto'
import ProductCard from './ProductCard'

interface ProductListProps {
  productos: Producto[]
  titulo?: string
}

function ProductList({ productos, titulo }: ProductListProps) {
  return (
    <section className="container mb-5">
      {titulo && <h2 className="text-center mb-4">{titulo}</h2>}
      <div className="row g-4">
        {productos.map((producto) => (
          <div className="col-6 col-md-4 col-lg-3" key={producto.id}>
            <ProductCard producto={producto} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductList
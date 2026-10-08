import ProductCard from '../components/ProductCard'
import { obtenerProductos } from '../services/productoService'

function Home() {
  const productos = obtenerProductos()

  return (
    <section className="container py-5">
      <h2 className="text-center mb-4">Productos más Vendidos</h2>

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

export default Home
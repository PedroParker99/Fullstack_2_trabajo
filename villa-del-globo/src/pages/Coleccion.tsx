import TarjetaColeccion from '../components/TarjetaColeccion'
import { obtenerProductos } from '../services/productoService'

function Coleccion() {
  const productos = obtenerProductos()

  return (
    <main className="container py-5">
      <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
        {productos.map((producto) => (
          <div className="col producto-col" key={producto.id}>
            <TarjetaColeccion producto={producto} />
          </div>
        ))}
      </div>
    </main>
  )
}

export default Coleccion
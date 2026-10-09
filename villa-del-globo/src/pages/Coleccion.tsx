import ProductList from '../components/ProductList'
import { obtenerProductos } from '../services/productoService'

function Coleccion() {
  const productos = obtenerProductos()
  const disponibles = productos.filter((p) => p.disponible)

  return (
    <>
      <div className="container text-center my-5">
        <h1 className="fw-bold">Catálogo</h1>
        <p className="text-muted">Todos nuestros productos en un solo lugar</p>
      </div>

      <ProductList productos={productos} />

      <ProductList titulo="Disponibles ahora" productos={disponibles} />
    </>
  )
}

export default Coleccion
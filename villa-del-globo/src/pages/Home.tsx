import CarruselProductos from '../components/CarruselProductos'
import CategoriaCard from '../components/CategoriaCard'
import ProductCard from '../components/ProductCard'
import SeccionTematica from '../components/SeccionTematica'
import { obtenerCategorias } from '../services/categoriaService'
import { obtenerProductos } from '../services/productoService'
import { obtenerTematicasDestacadas } from '../services/tematicaService'

function Home() {
  const categorias = obtenerCategorias()
  const productos = obtenerProductos()
  const masVendidos = productos.slice(0, 4)
  const tematicas = obtenerTematicasDestacadas()

  return (
    <>
      <div className="banner-hero">
        <img
          src="/img/Banner_portada.png"
          className="w-100 h-100"
          alt="Villa del Globo - Cotillón infantil"
        />
      </div>

      <div className="bg-rosa text-white text-center py-2">
        <span className="fw-bold fs-5">
          Envío Gratis desde $45.000 &nbsp;|&nbsp; 🚛 Envíos a todo Chile &nbsp;|&nbsp;
          Envío Gratis desde $45.000 &nbsp;|&nbsp; 🚛 Envíos a todo Chile
        </span>
      </div>

      <div className="container text-center my-5">
        <h1 className="fw-bold">Decoración de Cumpleaños Temática en Chile</h1>
        <p className="text-muted">
          Encuentra sets, globos, manteles y más de 50 temáticas
        </p>
      </div>

      <section className="container mb-5 seccion-categorias">
        <h2 className="text-center mb-4">Explora por Temática</h2>
        <div className="row g-3">
          {categorias.map((categoria) => (
            <div className="col-6 col-md-4" key={categoria.id}>
              <CategoriaCard categoria={categoria} />
            </div>
          ))}
        </div>
      </section>

      <section className="container mb-5">
        <h2 className="text-center mb-4">Productos más Vendidos</h2>
        <div className="row g-4">
          {masVendidos.map((producto) => (
            <div className="col-6 col-md-4 col-lg-3" key={producto.id}>
              <ProductCard producto={producto} />
            </div>
          ))}
        </div>
      </section>

      <section className="container mb-5">
        <h2 className="text-center mb-4">Novedades en Decoración</h2>
        <CarruselProductos id="carruselProductos" productos={productos} />
      </section>

      {tematicas.map((tematica) => (
        <SeccionTematica key={tematica.id} tematica={tematica} />
      ))}

      <section className="container text-center my-5 texto-descripcion">
        <p className="text-muted">
          Villa del Globo es tu tienda online de artículos de fiesta y decoración
          temática para cumpleaños infantiles en Chile. Encuentra sets completos,
          globos metalizados, manteles, piñatas, coronas y mucho más con los
          personajes que tus hijos aman: Bluey, Frozen, Spiderman, Peppa Pig,
          Minecraft, Barbie y más de 50 temáticas disponibles. Con envío a todo
          Chile y despacho gratis desde $45.000 en la Región Metropolitana y 8ª
          Región.
        </p>
      </section>
    </>
  )
}

export default Home
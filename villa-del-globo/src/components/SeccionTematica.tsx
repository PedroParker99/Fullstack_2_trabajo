import type { TematicaDestacada } from '../models/TematicaDestacada'

interface SeccionTematicaProps {
  tematica: TematicaDestacada
}

function SeccionTematica({ tematica }: SeccionTematicaProps) {
  const { nombre, descripcion, imagen, ruta, color, imagenIzquierda, articulos } = tematica

  const ordenImagen = imagenIzquierda ? 'order-md-1' : 'order-md-2'
  const ordenTexto = imagenIzquierda ? 'order-md-2' : 'order-md-1'

  return (
    <section className="container mb-5">
      <div className="row align-items-center g-4 bg-light rounded p-4">
        <div className={`col-md-5 ${ordenImagen}`}>
          <img
            src={imagen}
            className="img-fluid rounded shadow-sm"
            alt={`Temática ${nombre}`}
          />
        </div>

        <div className={`col-md-7 ${ordenTexto}`}>
          <span className={`badge bg-${color} mb-2`}>Temática destacada</span>
          <h2 className="fw-bold">{nombre}</h2>
          <p className="text-muted">{descripcion}</p>

          <div className="d-flex flex-wrap gap-2">
            {articulos.map((articulo) => (
              <a
                href="#"
                key={articulo}
                className={`btn btn-outline-${color} rounded-pill`}
              >
                {articulo}
              </a>
            ))}
          </div>

          <a href={ruta} className={`btn btn-${color} mt-4`}>
            Ver todo de {nombre}
          </a>
        </div>
      </div>
    </section>
  )
}

export default SeccionTematica
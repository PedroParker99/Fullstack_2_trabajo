import { Link } from 'react-router'

function NoEncontrada() {
  return (
    <main className="container py-5">
      <div className="bg-white rounded-4 shadow-sm p-5 text-center">
        <img
          src="/img/Casa_Globos_sinfondo.png"
          alt=""
          className="img-fluid mb-4"
          style={{ maxHeight: '220px' }}
        />

        <span className="text-rosa small fw-bold text-uppercase">Error 404</span>

        <h1 className="fw-bold mt-2 mb-3">¡Ups! Esta página se fue volando 🎈</h1>

        <p className="text-muted mb-4">
          La página que buscas no existe o cambió de lugar.
        </p>

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
          <Link to="/" className="btn btn-rosa">
            <i className="bi bi-house me-2"></i>
            Volver al inicio
          </Link>
          <Link to="/coleccion" className="btn btn-outline-secondary">
            Ver colección
          </Link>
        </div>
      </div>
    </main>
  )
}

export default NoEncontrada
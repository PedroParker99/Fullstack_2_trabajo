import { Link, NavLink } from "react-router";
import { useCarrito } from "../hooks/useCarrito";
import { useSesion } from "../hooks/useSesion";
import { obtenerTematicasMenu } from "../services/tematicaService";
import { crearSlug } from "../utils/texto";

const tematicas = obtenerTematicasMenu()


function Navbar() {
  const { cantidadTotal } = useCarrito()
  const { usuario, cerrarSesion } = useSesion()
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img
            src="/img/Villa_del_Globo_Mark.avif"
            alt="Villa del Globo"
            className="rounded-circle"
            height="70"
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
          aria-controls="menuPrincipal"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav ms-lg-3 mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>Inicio</NavLink>
            </li>

            <li className="nav-item dropdown mega-dropdown">
              <NavLink className="nav-link dropdown-toggle" to="/coleccion">
                Nuestra tienda
              </NavLink>

              <div className="dropdown-menu mega-menu p-4">
                <div className="row g-4">
                  {tematicas.map((columna, indice) => (
                    <div className="col-lg-4" key={indice}>
                      <h6 className="fw-bold border-bottom pb-2">
                        Temáticas {indice + 1}
                      </h6>
                      <ul className="list-unstyled mb-0">
                        {columna.map((nombre) => (
                          <li key={nombre}>
                            <Link to={`/coleccion/${crearSlug(nombre)}`} className="dropdown-item">{nombre}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/packs">Packs Decoración Cumpleaños</NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto d-flex flex-row align-items-center gap-3">
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-link text-dark p-0 border-0 shadow-none"
                aria-label="Buscar productos"
              >
                <i className="bi bi-search fs-2"></i>
              </button>
            </li>

            {/* Perfil: menú desplegable (igual que index.html) */}
            <li className="nav-item">
              <div className="dropdown">
                <button
                  type="button"
                  className="btn btn-link text-dark p-0 border-0 shadow-none"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-label="Cuenta de usuario"
                >
                  <i className={`bi ${usuario ? 'bi-person-check' : 'bi-person'} fs-2`}></i>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2 p-2">
                  <li>
                    <div className="px-2 py-1">
                      <p className="mb-0 small text-muted">
                        {usuario ? '¡Hola de nuevo!' : '¡Hola! Bienvenido a'}
                      </p>
                      <h6 className="fw-bold mb-0">
                        {usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Villa del Globo'}
                      </h6>
                      {usuario && <p className="mb-0 small text-muted">{usuario.correo}</p>}
                    </div>
                  </li>

                  <li>
                    <hr className="dropdown-divider my-2" />
                  </li>

                  {usuario ? (
                    <>
                    <li>
                      <Link to="/perfil" className="dropdown-item rounded py-2 fw-semibold text-white text-center bg-rosa">
                        <i className="bi bi-person me-2"></i>
                        Mi perfil
                      </Link>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item rounded py-2 text-danger"
                        onClick={cerrarSesion}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Cerrar sesión
                      </button>
                    </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          to="/ingresar"
                          className="dropdown-item rounded py-2 fw-semibold text-white text-center bg-rosa"
                        >
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Iniciar sesión
                        </Link>
                      </li>
                      <li>
                        <Link to="/registro" className="dropdown-item rounded py-2 text-muted small">
                          <i className="bi bi-person-plus me-2"></i>
                          ¿No tienes cuenta? Regístrate
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </li>

            <li className="nav-item">
              <button
                type="button"
                className="btn btn-link text-dark p-0 position-relative border-0 shadow-none"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasCarrito"
                aria-controls="offcanvasCarrito"
                aria-label="Ver carrito"
              >
                <i className="bi bi-bag fs-2"></i>
                {cantidadTotal > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-rosa">
                    {cantidadTotal}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
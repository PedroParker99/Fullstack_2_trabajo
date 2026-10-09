interface NavbarProps {
  cantidadCarrito?: number
}

const tematicas: string[][] = [
  ['Among Us', 'Baby Shark', 'Barbie', 'Bluey', 'Bob Esponja', 'Cars', 'Cinnamonroll', 'Circo Digital'],
  ['Dragon Ball', 'Dinosaurio', 'FNAF', 'Frozen', 'Guerreras K-pop', 'Hello Kitty', 'Intensamente', 'Kuromi'],
  ['Mario Bros', 'Masha', 'Merlina', 'Mickey Mouse', 'Minecraft', 'Minions', 'Minnie Mouse'],
]

function Navbar({ cantidadCarrito = 0 }: NavbarProps) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
      <div className="container">
        <a className="navbar-brand" href="#">
          <img
            src="/img/Villa_del_Globo_Mark.avif"
            alt="Villa del Globo"
            className="rounded-circle"
            height="70"
          />
        </a>

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
              <a className="nav-link active" href="#">Inicio</a>
            </li>

            <li className="nav-item dropdown mega-dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Nuestra tienda
              </a>

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
                            <a href="#" className="dropdown-item">{nombre}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">Packs Decoración Cumpleaños</a>
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

            <li className="nav-item">
              <button
                type="button"
                className="btn btn-link text-dark p-0 border-0 shadow-none"
                aria-label="Cuenta de usuario"
              >
                <i className="bi bi-person fs-2"></i>
              </button>
            </li>

            <li className="nav-item">
              <button
                type="button"
                className="btn btn-link text-dark p-0 position-relative border-0 shadow-none"
                aria-label="Ver carrito"
              >
                <i className="bi bi-bag fs-2"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-rosa">
                  {cantidadCarrito}
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
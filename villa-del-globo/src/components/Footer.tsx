interface Enlace {
  texto: string
  ruta: string
}

const enlaces: Enlace[] = [
  { texto: 'Inicio', ruta: '#' },
  { texto: 'Nuestra Tienda', ruta: '#' },
  { texto: 'Packs Decoración', ruta: '#' },
  { texto: 'Políticas de Envío', ruta: '#' },
  { texto: 'Contacto', ruta: '#' },
]

function Footer() {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <h5 className="fw-bold">🎈 Villa del Globo</h5>
            <p className="text-secondary">
              Todo lo que necesitas para tus fiestas: cotillón, decoración,
              globos, disfraces y mucho más.
            </p>
          </div>

          <div className="col-md-4">
            <h6 className="fw-bold">Tienda</h6>
            <ul className="list-unstyled">
              {enlaces.map((enlace) => (
                <li key={enlace.texto}>
                  <a href={enlace.ruta} className="link-light text-decoration-none">
                    {enlace.texto}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-4">
            <h6 className="fw-bold">Contacto</h6>
            <ul className="list-unstyled text-secondary">
              <li>📞 9 7909 9900</li>
              <li>✉️ villadelglobospa@gmail.com</li>
            </ul>

            <div className="d-flex gap-3 mt-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-light text-decoration-none fs-4"
                aria-label="Facebook"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-light text-decoration-none fs-4"
                aria-label="Instagram"
              >
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <p className="text-center text-secondary mb-0">
          &copy; 2026 Villa del Globo. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer
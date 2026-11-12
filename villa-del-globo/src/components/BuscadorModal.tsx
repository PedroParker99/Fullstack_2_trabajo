import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'

// Ventana del buscador (igual al modal #modalBuscador del HTML).
// Al buscar, lleva a la colección con el texto en la URL: /coleccion?buscar=bluey
function BuscadorModal() {
    const [texto, setTexto] = useState('')
    const navigate = useNavigate()

    const buscar = (evento: FormEvent<HTMLFormElement>) => {
        evento.preventDefault()
        const consulta = texto.trim()
        if (!consulta) return

        navigate(`/coleccion?buscar=${encodeURIComponent(consulta)}`)
        setTexto('')
    }

    return (
        <div className="modal fade" id="modalBuscador" tabIndex={-1} aria-labelledby="tituloBuscador" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header">
                        <h5 className="modal-title" id="tituloBuscador">
                            Buscar productos
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={buscar}>
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Buscar Toy Story, Mario Bros..."
                                    aria-label="Texto a buscar"
                                    required
                                    value={texto}
                                    onChange={(e) => setTexto(e.target.value)}
                                />
                                {/* data-bs-dismiss cierra la ventana al buscar */}
                                <button className="btn btn-rosa" type="submit" data-bs-dismiss="modal" aria-label="Buscar">
                                    <i className="bi bi-search"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuscadorModal
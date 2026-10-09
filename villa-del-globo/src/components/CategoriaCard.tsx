import type { Categoria } from '../models/Categoria'

interface CategoriaCardProps {
  categoria: Categoria
}

function CategoriaCard({ categoria }: CategoriaCardProps) {
  const { nombre, imagen, ruta } = categoria

  return (
    <a href={ruta} className="text-decoration-none">
      <div className="categoria-card">
        <img src={imagen} className="categoria-img" alt={nombre} />
        <span className="categoria-nombre">{nombre}</span>
      </div>
    </a>
  )
}

export default CategoriaCard
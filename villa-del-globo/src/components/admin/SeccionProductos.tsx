import { useState } from 'react'
import { useDatosApi } from '../../hooks/useDatosApi'
import type { ProductoApi } from '../../models/ProductoApi'
import {
  actualizarInventario,
  actualizarProductoApi,
  obtenerInventarios,
  obtenerProductosBackend,
} from '../../services/productoApiService'
import { obtenerMensajeError } from '../../utils/errores'
import { formatearPrecio } from '../../utils/formato'

const categorias = ['Set Decoración', 'Globos', 'Manteles', 'Vasos y Vajilla', 'Piñatas', 'Accesorios']

interface Edicion {
  nombre: string
  precio: number
  categoria: string
  stock: number
}

// Sección "Productos" del admin: lista los productos de ms_producto
// y permite editar nombre, precio, categoría y stock (disponibilidad).
function SeccionProductos() {
  const productos = useDatosApi(obtenerProductosBackend, [])
  const inventarios = useDatosApi(obtenerInventarios, [])

  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [edicion, setEdicion] = useState<Edicion | null>(null)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'danger'; texto: string } | null>(null)

  const stockDe = (productoId: number) =>
    inventarios.datos.find((i) => i.productoId === productoId)?.cantidadDisponible ?? 0

  const empezarEdicion = (p: ProductoApi) => {
    setEditandoId(p.id)
    setEdicion({ nombre: p.nombre, precio: p.precio, categoria: p.categoria ?? '', stock: stockDe(p.id) })
    setMensaje(null)
  }

  const guardar = async (p: ProductoApi) => {
    if (!edicion) return
    setGuardando(true)
    setMensaje(null)
    try {
      // 1) Datos del producto
      await actualizarProductoApi({ ...p, nombre: edicion.nombre, precio: edicion.precio, categoria: edicion.categoria })

      // 2) Stock: se cambia en el inventario y ms_producto sincroniza el producto
      const inventario = inventarios.datos.find((i) => i.productoId === p.id)
      if (inventario && inventario.cantidadDisponible !== edicion.stock) {
        await actualizarInventario({ ...inventario, cantidadDisponible: edicion.stock })
      }

      setEditandoId(null)
      setMensaje({ tipo: 'success', texto: `"${edicion.nombre}" se actualizó correctamente.` })
      productos.recargar()
      inventarios.recargar()
    } catch (e) {
      setMensaje({ tipo: 'danger', texto: obtenerMensajeError(e) })
    } finally {
      setGuardando(false)
    }
  }

  const cargando = productos.cargando || inventarios.cargando
  const error = productos.error ?? inventarios.error

  return (
    <>
      <h1 className="fw-bold mb-1">Productos</h1>
      <p className="text-muted mb-4">Catálogo e inventario de ms_producto (puerto 8081).</p>

      {mensaje && <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {cargando && <div className="spinner-border text-rosa" role="status"></div>}

      {!cargando && !error && (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.datos.map((p) => {
                  const stock = stockDe(p.id)
                  const enEdicion = editandoId === p.id && edicion

                  return (
                    <tr key={p.id}>
                      <td>
                        <img src={p.imagenUrl ?? ''} alt={p.nombre} width={50} height={50} className="rounded object-fit-cover" />
                      </td>
                      {enEdicion ? (
                        <>
                          <td>
                            <input className="form-control form-control-sm" value={edicion.nombre}
                              onChange={(e) => setEdicion({ ...edicion, nombre: e.target.value })} />
                          </td>
                          <td>
                            <select className="form-select form-select-sm" value={edicion.categoria}
                              onChange={(e) => setEdicion({ ...edicion, categoria: e.target.value })}>
                              {categorias.map((c) => <option key={c}>{c}</option>)}
                            </select>
                          </td>
                          <td>
                            <input type="number" min={1} className="form-control form-control-sm" style={{ width: '110px' }}
                              value={edicion.precio}
                              onChange={(e) => setEdicion({ ...edicion, precio: Number(e.target.value) })} />
                          </td>
                          <td>
                            <input type="number" min={0} className="form-control form-control-sm" style={{ width: '80px' }}
                              value={edicion.stock}
                              onChange={(e) => setEdicion({ ...edicion, stock: Number(e.target.value) })} />
                          </td>
                          <td></td>
                          <td className="text-end text-nowrap">
                            <button type="button" className="btn btn-sm btn-rosa me-1" disabled={guardando} onClick={() => guardar(p)}>
                              <i className="bi bi-check-lg"></i>
                            </button>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setEditandoId(null)}>
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="fw-semibold">{p.nombre}</td>
                          <td>{p.categoria}</td>
                          <td>{formatearPrecio(p.precio)}</td>
                          <td>{stock}</td>
                          <td>
                            <span className={`badge ${stock > 0 ? 'bg-success' : 'bg-secondary'}`}>
                              {stock > 0 ? 'Disponible' : 'Agotado'}
                            </span>
                          </td>
                          <td className="text-end">
                            <button type="button" className="btn btn-sm btn-outline-dark" onClick={() => empezarEdicion(p)}>
                              <i className="bi bi-pencil me-1"></i>Editar
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

export default SeccionProductos

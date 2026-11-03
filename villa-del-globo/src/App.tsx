import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Coleccion from './pages/Coleccion'
import Carrito from './pages/Carrito'
import AdminPanel from './pages/AdminPanel'

function App() {
  return (
    <Routes>
      {/* Rutas públicas: comparten Navbar, Footer y carrito lateral */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="coleccion" element={<Coleccion />} />
        <Route path="carrito" element={<Carrito />} />
      </Route>

      {/* Panel de administración: sin el Navbar de la tienda */}
      <Route path="admin" element={<AdminPanel />} />
    </Routes>
  )
}

export default App
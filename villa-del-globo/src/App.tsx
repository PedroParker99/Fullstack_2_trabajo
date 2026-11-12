import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Coleccion from './pages/Coleccion'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import Registro from './pages/Registro'
import Ingresar from './pages/Ingresar'
import Perfil from './pages/Perfil'
import AdminPanel from './pages/AdminPanel'
import NoEncontrada from './pages/NoEncontrada'

function App() {
  return (
    <Routes>
      {/* Rutas públicas: comparten Navbar, Footer y carrito lateral */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="coleccion" element={<Coleccion />} />
        <Route path="coleccion/:tematica" element={<Coleccion />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="registro" element={<Registro />} />
        <Route path="ingresar" element={<Ingresar />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>

      {/* Panel de administración: sin el Navbar de la tienda */}
      <Route path="admin" element={<AdminPanel />} />
    </Routes>
  )
}

export default App
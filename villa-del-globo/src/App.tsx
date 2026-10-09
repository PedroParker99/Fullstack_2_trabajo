import Footer from './components/Footer'
import Catalogo from './pages/Coleccion'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <div className="page-wrapper">
        <Navbar />
        <Catalogo />
      </div>
      <Footer />
    </>
  )
}

export default App
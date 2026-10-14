import Footer from './components/Footer'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import CarritoOffcanvas from './components/CarritoOffcanvas'

function App() {
  return (
    <>
      <div className="page-wrapper">
        <Navbar />
        <Home />
      </div>
      <Footer />
      <CarritoOffcanvas />
    </>
  )
}

export default App
import Footer from './components/Footer'
import Home from './pages/Home'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <div className="page-wrapper">
        <Navbar />
        <Home />
      </div>
      <Footer />
    </>
  )
}

export default App
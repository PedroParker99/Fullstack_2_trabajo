import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'
import CarritoOffcanvas from './CarritoOffcanvas'
import BuscadorModal from './BuscadorModal'

function Layout() {
    return (
        <>
            <div className="page-wrapper">
                <Navbar />
                <Outlet />
            </div>
            <Footer />
            <CarritoOffcanvas />
            <BuscadorModal />
        </>
    )
}

export default Layout
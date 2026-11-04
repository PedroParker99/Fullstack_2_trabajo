import { Outlet } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'
import CarritoOffcanvas from './CarritoOffcanvas'

function Layout() {
    return (
        <>
            <div className="page-wrapper">
                <Navbar />
                <Outlet />
            </div>
            <Footer />
            <CarritoOffcanvas />
        </>
    )
}

export default Layout
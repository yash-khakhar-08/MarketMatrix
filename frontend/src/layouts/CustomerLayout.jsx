import { Outlet } from 'react-router-dom'
import Header from '../features/customer/components/Header'
import Footer from '../features/customer/components/Footer'

const CustomerLayout = () => {
    return (
        <div className="min-vh-100 d-flex flex-column ">
          <Header />

            <main className="flex-grow-1">
                <Outlet />
            </main>

            <Footer/>
        </div>
    )
}

export default CustomerLayout
import { Outlet } from "react-router-dom"
import AdminFooter from "../components/AdminFooter"
import AdminHeader from "../components/AdminHeader"

const AdminLayout = () => {
    return (

        <div className="d-flex flex-column min-vh-100">
            <AdminHeader/>
            <main className="flex-grow-1">
                <Outlet />
            </main>
            <AdminFooter/>
        </div>
    )
}

export default AdminLayout
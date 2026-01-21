import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Outlet } from 'react-router-dom'

const AdminRoute = () => {

    const {customer, token} = useSelector((state) => state.auth)

    const savedData = JSON.parse(localStorage.getItem('customer'))
    const persistedCustomer = customer || savedData?.userDto
    const persistedToken = token || savedData?.token

    if (!persistedToken || !persistedCustomer) {
        return <Navigate to="/login" replace />
    }

    if(persistedCustomer?.role !== "ROLE_ADMIN"){
        return <Navigate to="/unauthorized-access" replace />
    }

    return <Outlet />
}

export default AdminRoute
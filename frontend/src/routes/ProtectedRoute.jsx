import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { Outlet } from 'react-router-dom'

const ProtectedRoute = () => {

    const token = useSelector((state) => state.auth.token)

    const savedData = JSON.parse(localStorage.getItem('customer'))
    const persistedToken = token || savedData?.token

    if (!persistedToken) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute

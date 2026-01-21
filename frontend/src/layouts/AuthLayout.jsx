import { Outlet } from "react-router-dom"

const AuthLayout = () => {

    return (
        <div className="min-vh-100 bg-light">
            <Outlet />
        </div>
    )
}

export default AuthLayout
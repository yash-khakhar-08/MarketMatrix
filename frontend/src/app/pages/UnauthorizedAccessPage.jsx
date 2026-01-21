import { useEffect } from "react"
import { Link } from "react-router-dom"
import { logout } from "../../features/auth/authSlice"
import { useDispatch } from "react-redux"

const UnauthorizedAccessPage = () => {

    const dispatch = useDispatch()

    useEffect(() => {

        localStorage.removeItem("customer")
        dispatch(logout())

    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
            <h1 className="text-7xl font-bold text-blue-600">401</h1>

            <h2 className="text-2xl font-semibold mt-4 text-red-800">
                Unauthorized Access
            </h2>

            <p className="text-gray-500 mt-2 max-w-md">
                Oops! You've been logged out of the system.
            </p>

            <Link to="/" className="mt-6 inline-block px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
                Login back
            </Link>
        </div>
    )
}

export default UnauthorizedAccessPage
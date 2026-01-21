import { Link } from "react-router-dom"

const PageNotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
            <h1 className="text-7xl font-bold text-blue-600">404</h1>

            <h2 className="text-2xl font-semibold mt-4 text-gray-800">
                Page Not Found
            </h2>

            <p className="text-gray-500 mt-2 max-w-md">
                Oops! The page you are looking for doesn’t exist or may have been moved.
            </p>

            <Link to="/" className="mt-6 inline-block px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition">
                Go back home
            </Link>
        </div>
    )
}

export default PageNotFound
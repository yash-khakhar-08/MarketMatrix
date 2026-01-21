import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { logout } from "../../auth/authSlice"

const AdminHeader = () => {

    const {customer} = useSelector(state => state.auth)

    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem("customer")
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
            <Link className="navbar-brand" to="/admin/">MarketMatrix</Link>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/admin/addCategory">
                        Add Category
                        </Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link" to="/admin/addProduct">
                        Add Product
                        </Link>
                    </li>

                </ul>

                <div className="d-flex align-items-center mx-2">

                {
                    customer?
                    <>
                    <span className="nav-link text-white fw-bold ml-2">Welcome, {customer.fullName}</span>
                    <span className="nav-link text-white fw-bold ml-2" 
                    style={{ cursor: "pointer" }}
                    onClick={handleLogout}>Logout</span>
                    </>
                    : <Link className="nav-link text-white fw-bold ml-2" to="/signin">Login</Link>
                }
                    
                </div>
            </div>
        </nav>
    )

}

export default AdminHeader
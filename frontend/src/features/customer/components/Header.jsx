import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { logout } from "../../auth/authSlice"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { filterProducts } from "../products/services/product.service"

const Header = () => {

    const {customer, cart} = useSelector(state => state.auth)

    const dispatch = useDispatch()

    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedTerm, setDebouncedTerm] = useState("")

    const navigate = useNavigate()

    useEffect(() => {

      const handler = setTimeout(() => {
          setDebouncedTerm(searchTerm)
      }, 500)

      return () => clearTimeout(handler)

    }, [searchTerm])


    useEffect(() => {

      if (!debouncedTerm.trim()){
        return
      }

      const fetchProducts = async () => {
          try {
              const data = await filterProducts(debouncedTerm)
              navigate("/search-results", {
                  state: {
                      products: data.products,
                      searchTerm: debouncedTerm
                  }
              })
          } catch (err) {
              console.error(err.message)
          }
      }

      fetchProducts()

    }, [debouncedTerm])

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem("customer")
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
          <Link className="navbar-brand" to="/">
            MarketMatrix
          </Link>
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
                <Link className="nav-link" to="men">
                  Men
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to="women">
                  Women
                </Link>
              </li>

            </ul>
            <div className="w-50 align-items-center mr-auto">
              <form className="form-inline my-2 my-lg-0" >
                <input
                    className="form-control mr-sm-2 w-75"
                    type="search"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                
              </form>
            </div>

            <div className="d-flex align-items-center mx-2">
              <Link to="/cart">
              <button
                className="btn btn-primary position-relative d-flex align-items-center mx-2"
              >
                <span className="me-3">
                  <i className="bi bi-cart text-white"></i>
                  <span
                    id="cart-count"
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  >
                    {cart.length}
                  </span>
                </span>
              </button>
              </Link>

                {
                  customer?
                  <>
                  <Link to='/editProfile'>
                    <span className="nav-link text-white fw-bold ml-2">Welcome, {customer.fullName}</span>
                  </Link>
                  <span className="nav-link text-white fw-bold ml-2"
                  style={{ cursor: "pointer" }}
                  onClick={handleLogout}>Logout</span>
                  </>
                  : <Link className="nav-link text-white fw-bold ml-2" to="/login">Login</Link>
                }
                
            </div>
          </div>
        </nav>
    )
}

export default Header
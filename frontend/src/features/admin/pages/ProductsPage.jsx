import { useEffect, useState, useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import { fetchAllProducts, deleteProduct } from "../services/product.service"
import { useNavigate } from "react-router-dom"

const ProductsPage = () => {

    const { token } = useSelector(state => state.auth)

    const [products, setProducts] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const navigate = useNavigate()

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        setLoading(true)
        try {
            const data = await fetchAllProducts(token)
            setProducts(data.products)
        } catch (err) {
            setMessage(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = useCallback(async (productId) => {

        const result = await Swal.fire({
            title: "Delete Product?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it"
        })

        if (!result.isConfirmed) return

        try {

            await deleteProduct(token, {productId})
            
            setProducts(prev =>
                prev.map(p => 
                    p.id === productId ? { ...p, status: 'delete' } : p
                )
            )

            Swal.fire("Deleted!", "Product deleted successfully", "success")

        } catch(error) {
            Swal.fire("Error", error.message, "error")
        }

    }, [])

    const filteredProducts = useMemo(() => {
        return products.filter(p =>
            p.productName.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toString().startsWith(search.toLowerCase())
        )
    }, [products, search])

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredProducts, currentPage])

    useEffect(() => {
        setCurrentPage(1)
    }, [search])

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">🛍️ Product Management</h4>
        </div>

        <div className="card-body">
          {message && <div className="alert alert-danger">{message}</div>}

          <div className="row mb-3">
            <div className="col-md-4 ms-auto">
              <input
                className="form-control"
                placeholder="Search product..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" />
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map(product => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td className="text-center">
                            <img
                              src={`http://localhost:8080/products/${product.productImage}`}
                              alt={product.productName}
                              width="60"
                              height="60"
                              style={{ objectFit: "cover", borderRadius: "6px" }}
                            />
                          </td>
                          <td className="fw-semibold">{product.productName}</td>
                          <td>₹ {product.productPrice}</td>
                          <td>{product.productQty}</td>
                          <td>{product.status}</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => navigate("/admin/product/edit", {
                                state: { productData: product }
                            }) } >
                              Edit
                            </button>
                            {
                                product.status === 'active' &&
                                <button className="btn btn-sm btn-outline-danger mx-2"
                                onClick={() => handleDelete(product.id)}>
                                Delete
                                </button>
                            }
                            
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <nav className="d-flex justify-content-center mt-3">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p => p - 1)}>
                        Previous
                      </button>
                    </li>

                    {[...Array(totalPages)].map((_, i) => (
                      <li
                        key={i}
                        className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                      <button className="page-link" onClick={() => setCurrentPage(p => p + 1)}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
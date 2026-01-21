import { useEffect, useState, useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import { fetchAllCustomers, deleteCustomer } from "../services/customer.service"
import { useNavigate } from "react-router-dom"

const CustomersPage = () => {

    const { token } = useSelector(state => state.auth)

    const [customers, setCustomers] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const navigate = useNavigate()

    useEffect(() => {
        loadCustomers()
    }, [])

    const loadCustomers = async () => {
        setLoading(true)
        try {
            const data = await fetchAllCustomers(token)
            setCustomers(data.customers)
        } catch (err) {
            setMessage(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = useCallback(async (customerId) => {

        const result = await Swal.fire({
            title: "Delete Customer?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, delete it"
        })

        if (!result.isConfirmed) return

        try {

            await deleteCustomer(token, {customerId})
            
            setCustomers(prev =>
                prev.map(p => 
                    p.id === customerId ? { ...p, status: 'delete' } : p
                )
            )

            Swal.fire("Deleted!", "Customer deleted successfully", "success")

        } catch(error) {
            Swal.fire("Error", error.message, "error")
        }

    }, [])

    const filteredCustomers = useMemo(() => {
        return customers.filter(p =>
            p.fullName.toLowerCase().includes(search.toLowerCase()) ||
            p.id.toString().startsWith(search.toLowerCase()) || 
            p.email.toLowerCase().startsWith(search.toLowerCase()) || 
            p.mobileNo.toLowerCase().startsWith(search.toLowerCase())
        )
    }, [customers, search])

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)

    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredCustomers.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredCustomers, currentPage])

    useEffect(() => {
        setCurrentPage(1)
    }, [search])

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">Customer Management</h4>
        </div>

        <div className="card-body">
          {message && <div className="alert alert-danger">{message}</div>}

          <div className="row mb-3">
            <div className="col-md-4 ms-auto">
              <input
                className="form-control"
                placeholder="Search customer..."
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
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile No</th>
                      <th>Gender</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCustomers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No customers found
                        </td>
                      </tr>
                    ) : (
                      paginatedCustomers.map(customer => (
                        <tr key={customer.id}>
                          <td>{customer.id}</td>
                          <td className="text-center">{customer.fullName}</td>
                          <td className="fw-semibold">{customer.email}</td>
                          <td>{customer.mobileNo}</td>
                          <td>{customer.gender}</td>
                          <td>{customer.role}</td>
                          <td>{customer.status}</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => navigate("/admin/customer/edit", {
                                state: { customerData: customer }
                            }) } >
                              Edit
                            </button>
                            {
                                customer.status === 'active' &&
                                <button className="btn btn-sm btn-outline-danger mx-2"
                                onClick={() => handleDelete(customer.id)}>
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

export default CustomersPage
import { useEffect, useState, useMemo } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchAllOrders } from "../services/order.service"

const OrdersPage = () => {

    const { token } = useSelector(state => state.auth)

    const [orders, setOrders] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const navigate = useNavigate()

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        setLoading(true)
        try {
            const data = await fetchAllOrders(token)
            setOrders(data.orders)
        } catch (err) {
            setMessage(err.message)
        } finally {
            setLoading(false)
        }
    }

    const filteredOrders = useMemo(() => {

        return orders.filter(o => {

            const matchesSearch =
                o.id.toString().startsWith(search) ||
                o.userId.toString().startsWith(search)

            const matchesStatus = statusFilter === "ALL" || o.status === statusFilter

            return matchesSearch && matchesStatus
        })

    }, [orders, search, statusFilter])


    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        return filteredOrders.slice(startIndex, startIndex + itemsPerPage)
    }, [filteredOrders, currentPage])

    useEffect(() => {
        setCurrentPage(1)
    }, [search, statusFilter])

    const dateOptions = {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">🛍️ Orders Management</h4>
        </div>

        <div className="card-body">
          {message && <div className="alert alert-danger">{message}</div>}

          <div className="row mb-3">
            <div className="col-md-4">
                <select className="form-select" value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}>
                <option value="ALL">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Cancelled</option>
                </select>
            </div>

            <div className="col-md-4 ms-auto">
                <input className="form-control" placeholder="Search order by id or customer id..." value={search}
                onChange={e => setSearch(e.target.value)}/>
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
                      <th>Order Id</th>
                      <th>Customer Id</th>
                      <th>Order Date</th>
                      <th>Order Amt</th>
                      <th>Payment Mode</th>
                      <th>Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No Orders found
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.userId}</td>
                          <td>{new Date(order.date).toLocaleString("en-IN", dateOptions)}</td>
                          <td>₹ {order.purchaseAmt}</td>
                          <td>{order.paymentMode}</td>
                          <td>{order.status}</td>
                          <td className="text-center">
                            <button className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => navigate("/admin/order/edit", {
                                state: { orderData: order }
                            }) } >
                              View
                            </button>
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

export default OrdersPage
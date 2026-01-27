import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchOrders, cancelOrder } from "../services/order.service"
import Swal from "sweetalert2"

const ViewOrderPage = () => {

    const { customer, token } = useSelector((state) => state.auth)
    const [orderItems, setOrderItems] = useState([])
    const [loading, setLoading] = useState(true) 

    useEffect(() => {
        const loadOrders = async () => {
            setLoading(true)
            try {
                const data = await fetchOrders(token, customer.id)
                setOrderItems(data)
            } catch (err) {
                console.error(err)
                setOrderItems([])
            } finally {
                setLoading(false)
            }
        }
        loadOrders()
    }, [customer.id, token])

    const handleCancelOrder = async (orderId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You want to cancel order?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        })

        if (result.isConfirmed) {
            try {
                await cancelOrder(token, orderId)
                setOrderItems((prev) =>
                    prev.map((order) =>
                        order.id === orderId ? { ...order, status: "Canceled" } : order
                    )
                )
                Swal.fire("Canceled!", "Order has been canceled.", "success")
            } catch (err) {
                console.error(err)
                Swal.fire("Error", "Something went wrong on server", "error")
            }
        }
    }

    const dateOptions = {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    }

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <h2>🛒 Order History</h2>
                <div className="d-flex justify-content-center align-items-center mt-4">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                </div>
                <p className="mt-3">Fetching your orders...</p>
            </div>
        )
    }

    if (!orderItems.length) {
        return (
            <div className="container mt-5 text-center">
                <h2>🛒 Order History</h2>
                <h4>No Orders | Go to <Link to="/">Home</Link></h4>
            </div>
        )
    }

    return (
        <div className="container mt-5 order-container">
        <h2 className="text-center mb-4">🛒 Order History</h2>
        {orderItems.map((order) => (
            <div key={order.id} className="cart-item d-flex align-items-center mb-3">
            <Link to="">
                <img
                src={`${order.product?.productImage}`}
                alt={order.product?.productName || "Product"}
                />
            </Link>
            <div className="details">
                <h5>{order.product?.productName?.toUpperCase()}</h5>
                <p className="price">Subtotal: ₹{order.purchaseAmt}</p>
                <div className="order-info mt-2">
                <p className="mb-1">
                    <strong>Order Id:</strong> {order.id}
                </p>
                <p className="mb-1">
                    <strong>Date of Order:</strong>{" "}
                    {new Date(order.date).toLocaleString("en-IN", dateOptions)}
                </p>
                <p className="mb-1">
                    <strong>Quantity:</strong> {order.purchaseQty}
                </p>
                <p className="mb-1">
                    <strong>Payment Mode:</strong> {order.paymentMode}
                </p>
                <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <span
                    className={order.status === "Canceled" ? "text-danger" : "text-success"}
                    >
                    {order.status}
                    </span>
                </p>
                </div>
                {order.status === "Pending" && (
                <button
                    className="btn btn-danger btn-sm mt-3"
                    onClick={() => handleCancelOrder(order.id)}
                >
                    Cancel Order
                </button>
                )}
            </div>
            </div>
        ))}
        </div>
    )
}

export default ViewOrderPage

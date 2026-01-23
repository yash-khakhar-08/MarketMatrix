import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import { updateOrderStatus } from "../services/order.service"

const EditOrderPage = () => {

    const { state } = useLocation()

    const { orderData } = state || null

    const navigate = useNavigate()
    const { token } = useSelector(state => state.auth)

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [orderStatus, setOrderStatus] = useState()

    const [order, setOrder] = useState({
        id: "",
        userId: "",
        date: "",
        product: {},
        purchaseQty: "",
        purchaseAmt: "",
        status: "",
        paymentMode: ""
    })

    useEffect(() => {
       
        if(!orderData) return

        setOrder({
            id: orderData.id,
            userId: orderData.userId,
            date: orderData.date,
            product: orderData.product,
            purchaseQty: orderData.purchaseQty,
            purchaseAmt: orderData.purchaseAmt,
            status: orderData.status,
            paymentMode: orderData.paymentMode
        })

        setOrderStatus(orderData.status)

    }, [orderData])

    const handleChange = e => {
        const { value } = e.target
        setOrderStatus(value)
    }

    const handleSubmit = async e => {

        e.preventDefault()

        setSaving(true)

        try {

            const payload = {
                orderId: order.id,
                status: orderStatus
            }

            await updateOrderStatus(token, payload)

            Swal.fire("Updated", "Order status updated successfully", "success")

            navigate("/admin/manage-orders", {replace: true})

        } catch(error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" />
            </div>
        )
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

    return (
        <div className="container mt-4">

        <div className="card shadow">
            <div className="card-header bg-dark text-white">
            <h4 className="mb-0">✏️ Edit Order</h4>
            </div>

            <div className="card-body">

            <form onSubmit={handleSubmit}>
                <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Order Id</label>
                    <input
                    type="text"
                    className="form-control"
                    value={order.id}
                    disabled
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Customer Id</label>
                    <input
                    type="text"
                    className="form-control"
                    value={order.userId}
                    disabled
                    />
                </div>
                </div>

                <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Order Date</label>
                    <input
                    type="text"
                    className="form-control"
                    value={new Date(order.date).toLocaleString("en-IN", dateOptions)}
                    disabled
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Purchase Quantity</label>
                    <input
                    type="text"
                    className="form-control"
                    value={order.purchaseQty} 
                    disabled
                    />
                </div>
                </div>

                <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Purchase Amt</label>
                    <input
                    type="text"
                    className="form-control"
                    value={order.purchaseAmt}
                    disabled
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Order Status</label>
                   
                    <select className='form-control' value={orderStatus}
                        onChange={handleChange} disabled={order.status !== 'Pending'}
                        name="status" required>

                        <option value='' disabled>
                            --Select Status--
                        </option>

                        <option value="Pending" checked={order.status === 'Pending'}>
                            Pending
                        </option>

                        <option value="Canceled" checked={order.status === 'Canceled'}>
                            Cancelled
                        </option>

                        <option value="Delivered" checked={order.status === 'Delivered'}>
                            Delivered
                        </option>

                    </select>

                </div>
                </div>

                <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Payment Mode</label>
                    <input
                    type="text"
                    className="form-control"
                    value={order.paymentMode}
                    disabled
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Product Id</label>
                    <input
                    type="text"
                    className="form-control"
                    value={order.product.id}
                    disabled
                    />
                </div>
                
                </div>

                <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                    type="text"
                    className="form-control"
                    value={order.product.productName}
                    disabled
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Price</label>
                    <input
                    type="number"
                    name="productPrice"
                    className="form-control"
                    value={order.product.productPrice}
                    disabled
                    required
                    />
                </div>
                </div>

                <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                    name="productDesc"
                    className="form-control"
                    rows="3"
                    value={order.product.productDesc}
                    disabled
                    required
                />
                </div>

                <div className="mb-3">
                    <label className="form-label">Product Image</label>
                    <br />
                    <img
                    src={`http://localhost:8080/products/${order.product.productImage}`}
                    alt="product"
                    width="200"
                    style={{ borderRadius: "8px" }}
                    />
                </div>

                { order.status === 'Pending' &&

                    <div className="d-flex justify-content-end gap-2">
            
                    <button type="button" className="btn btn-secondary"
                        onClick={() => navigate(-1)} disabled={saving}>
                        Cancel
                    </button>

                    <button type="submit" className="btn btn-primary mx-2"
                        disabled={saving}>
                        {saving ? "Saving..." : "Update Order"}
                    </button>

                    </div>

                }

            </form>
            </div>
        </div>
        </div>
    )
}

export default EditOrderPage
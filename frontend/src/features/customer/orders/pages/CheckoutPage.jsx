import { useState, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { makeOrder } from "../services/order.service"
import { saveAddress } from "../../profile/services/profile.service"
import { setAuthData } from "../../../auth/authSlice"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

const CheckoutPage = () => {

    const { customer, cart = [], token } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [paymentMode, setPaymentMode] = useState("COD")
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [loading, setLoading] = useState(false)

    const [address, setAddress] = useState({
        blockNo: "",
        apartmentName: "",
        city: "",
        state: "",
        pinCode: "",
        country: ""
    })

    const totalAmount = useMemo(
        () => cart.reduce((sum, item) => sum + (item.product.productQty > 0 ? item.purchaseAmt : 0), 0),
        [cart]
    )

    const persistAuth = (updatedCustomer, updatedCart = cart) => {
        dispatch(setAuthData({ token, customer: updatedCustomer, cart: updatedCart }))

        localStorage.setItem(
            "customer",
            JSON.stringify({ userDto: updatedCustomer, cartList: updatedCart, token })
        )
    }

    const handlePaymentModeChange = (mode) => setPaymentMode(mode)

    const handleSaveAddress = async () => {
        
        const { blockNo, apartmentName, city, state, pinCode, country } = address

        if (!blockNo.trim() || !apartmentName.trim() || !city.trim() || 
            !state.trim() || !pinCode.trim() || !country.trim()
        ) {
            alert("All address fields are required!")
            return
        }

        try {
            await saveAddress(token, { userId: customer.id, ...address })
            const fullAddress = `${blockNo}, ${apartmentName}, ${city}, ${state}, ${pinCode}, ${country}`
            const updatedCustomer = { ...customer, address: fullAddress }
            persistAuth(updatedCustomer)
            setShowAddressModal(false)
        } catch (err) {
            console.error(err)
            alert("Failed to save address. Try again!")
        }
    }

    const placeOrder = async () => {

        try {
            
            setLoading(true)

            await makeOrder(token, customer.id, paymentMode)

            persistAuth(customer, cart.filter(item => item.product.productQty === 0))

            Swal.fire("Order Confirmed", "Your order has been placed successfully", "success")

            navigate('/orders', {replace: true})

        } catch (err) {
            console.error(err)
            alert("Failed to place order. Try again!")
        } finally{
            setLoading(false)
        }
    }

    const handlePayment = async () => {

        if (!customer.address) {
            Swal.fire("Missing Address", "Delivery Address is required to place order!", "error")
            return
        }

        const result = await Swal.fire({
            title: "Confirm Order",
            text: "Do you want to place this order?",
            icon: "question", 
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, place order",
            cancelButtonText: "Cancel"
        })

        if (!result.isConfirmed) return

        if (paymentMode === "COD") {
            placeOrder()
        } else {
            navigate("/payment", { state: { token, totalAmount, customerId: customer.id } })
        }

    }

    return (
        <div className="container mt-5">
        <h2 className="text-center mb-4">🛒 Checkout</h2>

        <div className="card p-4 shadow-sm">
            <form>
            <div className="form-group mb-3">
                <label>Name</label>
                <input
                type="text"
                className="form-control"
                value={customer.fullName}
                readOnly
                />
            </div>

            <div className="form-group mb-3">
                <label>Shipping Address</label>
                <textarea
                className="form-control"
                rows="2"
                value={customer.address || ""}
                readOnly
                />
                <button
                type="button"
                className="btn btn-sm btn-secondary mt-2"
                onClick={() => setShowAddressModal(true)}
                disabled={loading}>
                Edit Address
                </button>
            </div>

            <h4 className="text-primary text-center mb-3">
                Grand Total: <span className="text-dark">₹{totalAmount}</span>
            </h4>

            <h5 className="mt-4">Payment Options</h5>
            <div className="form-check">
                <input
                className="form-check-input"
                type="radio"
                name="payment"
                id="COD"
                checked={paymentMode === "COD"}
                disabled={loading}
                onChange={() => handlePaymentModeChange("COD")}
                />
                <label className="form-check-label">Cash on Delivery (COD)</label>
            </div>
            <div className="form-check">
                <input
                className="form-check-input"
                type="radio"
                name="payment"
                id="Card"
                checked={paymentMode === "Card"}
                disabled={loading}
                onChange={() => handlePaymentModeChange("Card")}
                />
                <label className="form-check-label">Stripe Pay</label>
            </div>

            {totalAmount > 0 && 
            <button
                type="button"
                className="btn btn-success btn-block mt-4"
                onClick={() => handlePayment()}
                disabled={loading}
            >
                {paymentMode === "COD" ? 
                    loading ? "Placing Order..." : "Place Order" 
                    : 
                    "Make Payment"
                }

            </button>
            }
            </form>
        </div>

        {/* Address Modal */}
        {showAddressModal && (
            <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5>Edit Address</h5>
                    <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddressModal(false)}
                    />
                </div>
                <div className="modal-body">
                    {["blockNo","apartmentName","city","state","pinCode","country"].map((field) => (
                    <div className="form-group mb-2" key={field}>
                        <label>{field}</label>
                        <input
                        type="text"
                        className="form-control"
                        value={address[field]}
                        onChange={(e) =>
                            setAddress((prev) => ({ ...prev, [field]: e.target.value }))
                        }
                        />
                    </div>
                    ))}
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowAddressModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSaveAddress}>Save</button>
                </div>
                </div>
            </div>
            </div>
        )}

        </div>
    )
}

export default CheckoutPage

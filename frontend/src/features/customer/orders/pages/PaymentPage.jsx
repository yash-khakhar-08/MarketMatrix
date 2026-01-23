import { 
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe, 
    useElements 
} from "@stripe/react-stripe-js"
import { useLocation, useNavigate } from "react-router-dom"
import { createPaymentIntent, makeOrder, rollbackPayment } from "../services/order.service"
import { useDispatch, useSelector } from "react-redux"
import { setAuthData } from "../../../auth/authSlice"
import { useState } from "react"

const elementStyle = {
    style: {

        base: {
            fontSize: "16px",
            color: "#32325d",
            fontFamily: "Inter, sans-serif",
            "::placeholder": { color: "#a0aec0" },
        },

        invalid: {
            color: "#e53e3e",
        },
    },
}


const PaymentPage = () => {

    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    const { state } = useLocation()
    const totalAmount = state?.totalAmount

    const { customer, cart, token } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    const persistAuth = () => {

        const updatedCart = cart.filter(item => item.product.productQty === 0)

        dispatch(setAuthData({ token, customer, cart: updatedCart }))
    
        localStorage.setItem(
            "customer",
            JSON.stringify({ userDto: customer, cartList: updatedCart, token })
        )

    }

    const handlePayment = async () => {

        try {
            
            setLoading(true)

            const data = await createPaymentIntent(token, { amount: totalAmount * 100 })

            const clientSecret = data.message

            const cardNumber = elements.getElement(CardNumberElement)

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardNumber,
                },
            })

            if (result.error) {
                setLoading(false)
                navigate("/payment/failure", { state: { reason: result.error.message } })
                return
            }

            const paymentIntentId = result.paymentIntent.id

            try {

                await makeOrder(token, customer.id, "CARD")
                persistAuth() 

                navigate("/payment/success", {replace: true})

            } catch (orderErr) {
                
                await rollbackPayment(token, {paymentIntentId})

                setLoading(false)

                navigate("/payment/failure", {
                    state: { reason: `Order failed. Amount will be refunded.\nReason of failure: ${orderErr.message}` },
                })
                
            }

        } catch (err) {
            setLoading(false)
            navigate("/payment/failure", { state: { reason: err.message } })
        } 

    }

    if(!totalAmount || totalAmount <= 0){
        return navigate('/unauthorized-access', {replace: true})
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h3 className="text-center mb-4">Secure Card Payment</h3>

                <div className="form-group mb-3">
                    <label>Card Number</label>
                    <div className="form-control">
                        <CardNumberElement options={elementStyle} />
                    </div>
                </div>

                <div className="row">

                    <div className="col-md-6 mb-3">
                        <label>Expiry Date</label>
                        <div className="form-control">
                        <CardExpiryElement options={elementStyle} />
                        </div>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label>CVV</label>
                        <div className="form-control">
                        <CardCvcElement options={elementStyle} />
                        </div>
                    </div>

                </div>

                <div className="d-flex justify-content-between mt-4">

                    <button className="btn btn-secondary" 
                        onClick={() => navigate(-1, {replace: true})}
                        disabled={loading}>
                            Cancel
                    </button>

                    <button className="btn btn-success" 
                        onClick={handlePayment}
                        disabled={loading}>
                        Pay Now
                    </button>
                </div>

            </div>
        </div>
    )
}

export default PaymentPage
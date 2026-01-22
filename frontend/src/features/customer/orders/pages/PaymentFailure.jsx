import { useLocation } from "react-router-dom"

const PaymentFailure = () => {

    const { state } = useLocation()

    return (
        <div className="container text-center mt-5">
        <h2 className="text-danger">❌ Payment Failed</h2>
        <p>{state?.reason || "Something went wrong"}</p>
        <a href="/cart" className="btn btn-warning">Retry Placing Order</a>
        </div>
    )
}

export default PaymentFailure
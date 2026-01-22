import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

const StripeLayout = ({ children }) => {
    return <Elements stripe={stripePromise}>{children}</Elements>
}

export default StripeLayout
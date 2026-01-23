import { useState } from "react"
import Logo from "../../../logo.png"
import Swal from "sweetalert2"
import { useSearchParams } from "react-router-dom"
import { verifyAccount } from "../services/auth.service"

const AccountActivationPage = () => {

    const [searchParams] = useSearchParams()

    const email = searchParams.get("email")
    const token = searchParams.get("token")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [isAccountVerified, setIsAccountVerified] = useState(false)

    const verifyAccountHandler = async (e) => {

        e.preventDefault()
        setError("")
        setLoading(true)

        if(!email || !token){
            setError('Something went wrong. Please try again')
            setLoading(false)
            return
        }

        try {
            
            await verifyAccount({
                email,
                otp: token
            })

            Swal.fire(
                "Account Verified",
                "Account is verified. You can now login.", 
                "success"
            )

            setIsAccountVerified(true)

        } catch (err) {
            setError(err?.message || "Something went wrong. Please try again")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container d-flex justify-content-center">
            <div className="card p-4 shadow-lg" style={{ maxWidth: 400, width: "100%" }}>

                <div className="text-center mb-4 bg-dark">
                    <img
                        src={Logo}
                        alt="MarketMatrix Logo"
                        className="img-fluid"
                        style={{ maxWidth: 200 }}
                    />
                </div>

                <h2 className="text-center">Account Verification</h2>

                <form onSubmit={verifyAccountHandler}>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={email}
                            disabled
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading || isAccountVerified}
                    >
                        {loading ? "Verifying..." :
                        isAccountVerified ? "Account Verified" : "Verify Account"}

                    </button>

                </form>

                {error && (
                    <div className="alert alert-danger text-center mt-3">
                        {error}
                    </div>
                )}

                <hr />

            </div>
        </div>
    )
}

export default AccountActivationPage

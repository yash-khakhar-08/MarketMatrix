import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../../../logo.png"
import Swal from "sweetalert2"
import { verifyEmail, verifyOtpCode, changePassword } from "../services/auth.service"

const ForgotPasswordPage = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        otp: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [isOtpSent, setOtpSent] = useState(false)
    const [isOtpVerified, setOtpVerified] = useState(false)

    const handleOnChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const verifyEmailHandler = async (e) => {

        e.preventDefault()
        setError("")
        setLoading(true)

        if(!formData.email.trim()){
            setError("Invalid email")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Invalid email")
            return;
        }

        try {
            
            setOtpSent(false)

            const data = await verifyEmail({email: formData.email})

            Swal.fire(
                data.message,
                "Otp is sent to your verified email", 
                "success"
            )

            setOtpSent(true)

        } catch (err) {
            setError(err?.message || "Invalid email")
        } finally {
            setLoading(false)
        }
    }

    const verifyOtpHandler = async (e) => {
        
        e.preventDefault()
        setError("")
        setLoading(true)

        if(!formData.otp.trim()){
            setError("Invalid OTP")
            setLoading(false)
            return
        }

        try {

            setOtpVerified(false)

            await verifyOtpCode({
                email: formData.email, 
                otp: formData.otp
            })

            Swal.fire(
                "Otp Verified",
                "Otp is verified Successfully.", 
                "success"
            )

            setOtpVerified(true)

        } catch (err) {
            setError(err?.message || "Invalid Otp")
        } finally {
            setLoading(false)
        }
    }

    const changePasswordHandler = async (e) => {
        
        e.preventDefault()
        setError("")
        setLoading(true)

        if(!formData.password.trim()){
            setError("Password cannot be empty")
            setLoading(false)
            return
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,12}$/;
        if (!passwordRegex.test(formData.password)) {
            setError("Please enter a valid password with format. Minimum 8 and Maximum 12 character. Atleast One Upper case, One Lower case character and atleast One digit and One symbol.")
            setLoading(false)
            return
        }

        try {

            await changePassword({
                email: formData.email, 
                otp: formData.otp,
                password: formData.password
            })

            Swal.fire(
                "Password Updated",
                "Password is updated Successfully.", 
                "success"
            )

            navigate('/login')

        } catch (err) {
            setError(err?.message || "Invalid Otp")
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

                <h2 className="text-center">Forgot Password</h2>

                <form onSubmit={verifyEmailHandler}>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleOnChange}
                            disabled={isOtpSent || loading}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading || isOtpSent}
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>

                </form>

                {isOtpSent && 
                <form onSubmit={verifyOtpHandler}>

                    <div className="form-group mt-2">
                        <label>Enter OTP</label>
                        <input
                            type="text"
                            name="otp"
                            className="form-control"
                            value={formData.otp}
                            onChange={handleOnChange}
                            disabled={loading || isOtpVerified}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading || isOtpVerified}
                    >
                        {loading ? "Verifying..." : "Verify Otp"}
                    </button>

                </form>
                }

                {isOtpVerified && 
                <form onSubmit={changePasswordHandler}>

                   <div className="form-group mt-2">
                        <label>Enter New Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleOnChange}
                                disabled={loading}
                                required
                            />
                            <div className="input-group-append">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword(p => !p)}
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? "Changing..." : "Change Password"}
                    </button>

                </form>
                }

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

export default ForgotPasswordPage

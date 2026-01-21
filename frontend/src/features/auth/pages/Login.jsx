import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import Logo from "../../../logo.png"
import { login } from "../services/auth.service"
import { setAuthData } from "../authSlice"

const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleOnChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const data = await login(formData)

            localStorage.setItem("customer", JSON.stringify(data))

            dispatch(setAuthData({
                token: data.token,
                customer: data.userDto,
                cart: data.cartList
            }))

            alert("User Logged in!!")

            if(data.userDto.role === 'ROLE_ADMIN'){
                navigate("/admin/", { replace: true })
            } else{
                navigate("/", { replace: true })
            }

        } catch (err) {
            setError(err?.message || "Invalid email or password")
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

                <h2 className="text-center">Sign In</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleOnChange}
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
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <div className="text-center mt-3">
                        <Link to="/forgot-password" className="text-muted">
                            Forgot Password?
                        </Link>
                    </div>
                </form>

                {error && (
                    <div className="alert alert-danger text-center mt-3">
                        {error}
                    </div>
                )}

                <hr />

                <p className="text-center mt-3">New to MarketMatrix?</p>
                <Link to="/register" className="btn btn-success btn-block">
                    Create Your Account
                </Link>
            </div>
        </div>
    )
}

export default Login

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Logo from "../../../logo.png"
import { register } from "../services/auth.service"
import Swal from "sweetalert2"

const Register = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNo: "",
        gender: "male"
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

        if(!formData.fullName.trim()){
            setError("Name cannot be empty")
            return
        }

        if(formData.mobileNo.length !== 10){
            setError("Mobile Numner must be of 10 digits")
            return
        }

        const mobileNoRegex = /^[6-9]\d{9}$/
        if (!mobileNoRegex.test(formData.mobileNo)) {
            setError("Please enter valid Indian Phone Number")
            return
        }

        if(!formData.email.trim()){
            setError("Email cannot be empty")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!formData.password.trim() || !formData.confirmPassword.trim()) {
            setError("Passwords cannot be empty")
            return
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,12}$/;
        if (!passwordRegex.test(formData.password)) {
            setError("Please enter a valid password with format. Minimum 8 and Maximum 12 character. Atleast One Upper case, One Lower case character and atleast One digit and One symbol.")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)

        try {

            await register({
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password.trim(),
                gender: formData.gender,
                mobileNo: formData.mobileNo.trim()
            })

            Swal.fire({
                icon: 'info',
                title: 'Account Verification',
                text: 'Account Verification Link is sent to your registered email. Please Verify your Accouunt.'
            })

            navigate("/login", { replace: true })

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 shadow-lg" style={{ maxWidth: 500, width: "100%" }}>

                <div className="text-center mb-4 bg-dark">
                    <img src={Logo} alt="MarketMatrix Logo" className="img-fluid" style={{ maxWidth: 200 }} />
                </div>

                <h2 className="text-center">Sign Up</h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            name="fullName"
                            className="form-control"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Gender</label><br />
                        <input type="radio" name="gender" value="male" defaultChecked onChange={handleOnChange} /> Male
                        <input type="radio" name="gender" value="female" className="ml-3" onChange={handleOnChange} /> Female
                    </div>

                    <div className="form-group">
                        <label>Mobile Number</label>
                        <input
                            name="mobileNo"
                            className="form-control"
                            required
                            onChange={handleOnChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
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
                                onChange={handleOnChange}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(p => !p)}
                            >
                                {showPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            className="form-control"
                            onChange={handleOnChange}
                            required
                        />
                    </div>

                    <button
                        className="btn btn-success btn-block"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                {error && (
                    <div className="alert alert-danger mt-3 text-center">
                        {error}
                    </div>
                )}

                <hr />

                <p className="text-center">
                    Already have an account? <Link to="/signin">Sign in</Link>
                </p>
            </div>
        </div>
    )
}

export default Register
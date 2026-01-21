import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2"
import { setAuthData } from "../../../auth/authSlice"
import { updateProfile } from "../services/profile.service"

const EditProfilePage = () => {

    const { customer, token, cart } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        fullName: "",
        gender: "",
        mobileNo: ""
    })

    useEffect(() => {
        if (customer) {
            setFormData({
                fullName: customer.fullName || "",
                gender: customer.gender || "",
                mobileNo: customer.mobileNo || ""
            })
        }
    }, [customer])

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async e => {
        e.preventDefault()

        if (!formData.fullName.trim() || !formData.mobileNo.trim()) {
            Swal.fire("Validation", "Name and Mobile are required", "warning")
            return
        }

        if(formData.mobileNo.length !== 10){
            Swal.fire("Validation", "Mobile Numner must be of 10 digits", "warning")
            return
        }

        const mobileNoRegex = /^[6-9]\d{9}$/

        if (!mobileNoRegex.test(formData.mobileNo)) {
            Swal.fire("Validation", "Please enter valid Indian Phone Number", "warning")
            return;
        }

        setLoading(true)

        const updatedCustomer = {
                ...customer,
                fullName: formData.fullName,
                gender: formData.gender,
                mobileNo: formData.mobileNo
            }

        try {
            
            await updateProfile(token, updatedCustomer)

            Swal.fire("Success", "Profile updated successfully", "success")

            dispatch(setAuthData({
                token,
                customer: updatedCustomer,
                cart
            }))

            localStorage.setItem("customer", JSON.stringify({
                token,
                userDto: updatedCustomer,
                cartList: cart
            }))

            setFormData(prev => ({ ...prev }))

        } catch(error) {
            Swal.fire("Error", error.message, "error")
        } finally {
            setLoading(false)
        }
    }

    if (!customer) return null

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">👤 Edit Profile</h4>
                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Full Name</label>
                            <input
                            type="text"
                            name="fullName"
                            className="form-control"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Gender</label>
                            <select
                            name="gender"
                            className="form-control"
                            value={formData.gender}
                            onChange={handleChange}
                            >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            </select>
                        </div>
                        </div>

                        <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Mobile Number</label>
                            <input
                            type="text"
                            name="mobileNo"
                            className="form-control"
                            value={formData.mobileNo}
                            onChange={handleChange}
                            minLength="10"
                            maxLength="10"
                            required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">Email</label>
                            <input
                            type="email"
                            className="form-control"
                            value={customer.email}
                            readOnly
                            />
                        </div>
                        </div>

                        <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea
                            className="form-control"
                            rows="2"
                            value={customer.address || "Not Set"}
                            readOnly
                        />
                        </div>

                        <hr />

                        

                        <div className="d-flex justify-content-end">
                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Save Changes"}
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditProfilePage
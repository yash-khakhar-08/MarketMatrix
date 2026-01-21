import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import { updateCustomer } from "../services/customer.service"

const EditCustomerPage = () => {

    const { state } = useLocation()

    const { customerData } = state || null

    const navigate = useNavigate()
    const { token } = useSelector(state => state.auth)

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    const [customer, setCustomer] = useState({
        id: "",
        fullName: "",
        email: "",
        mobileNo: "",
        gender: "",
        address: "",
        status: "",
        role: ""
    })

    useEffect(() => {
       
        if(!customerData) return

        setCustomer({
            id: customerData.id,
            fullName: customerData.fullName,
            email: customerData.email,
            mobileNo: customerData.mobileNo,
            gender: customerData.gender,
            address: customerData.address,
            status: customerData.status,
            role: customerData.role
        })

    }, [customerData])

    const handleChange = e => {
        const { name, value } = e.target
        setCustomer(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async e => {

        e.preventDefault()

        setSaving(true)

        try {

            await updateCustomer(token, customer)

            Swal.fire("Updated", "Customer updated successfully", "success")

            navigate("/admin/manage-customers", {replace: true})

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

    return (
        <div className="container mt-4">

        <div className="card shadow">
            <div className="card-header bg-dark text-white">
            <h4 className="mb-0">✏️ Edit Customer</h4>
            </div>

            <div className="card-body">

            <form onSubmit={handleSubmit}>
                <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Customer Name</label>
                    <input
                    type="text"
                    name="fullName"
                    className="form-control"
                    value={customer.fullName}
                    onChange={handleChange}
                    disabled
                    required
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                    type="text"
                    name="email"
                    className="form-control"
                    value={customer.email}
                    onChange={handleChange}
                    disabled
                    required
                    />
                </div>
                </div>

                <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Mobile No</label>
                    <input
                    type="text"
                    name="mobileNo"
                    className="form-control"
                    value={customer.mobileNo}
                    onChange={handleChange}
                    disabled
                    required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Gender</label>
                    <input
                    type="text"
                    name="gender"
                    className="form-control"
                    value={customer.gender}
                    onChange={handleChange}
                    disabled
                    required
                    />
                </div>
                </div>

                <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Role</label>

                    <select className='form-control' value={customer.role}
                        onChange={handleChange} disabled={loading}
                        name="role" required>

                        <option value='' disabled>
                            --Select Category--
                        </option>

                        <option value="ROLE_USER" checked={customer.role === 'ROLE_USER'}>
                            ROLE_USER
                        </option>

                        <option value="ROLE_ADMIN" checked={customer.role === 'ROLE_ADMIN'}>
                            ROLE_ADMIN
                        </option>

                    </select>

                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label">Status</label>
                    <input
                    type="text"
                    name="role"
                    className="form-control"
                    value={customer.status}
                    disabled
                    required
                    />
                </div>
                </div>

                <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                    name="address"
                    className="form-control"
                    rows="3"
                    value={customer.address}
                    disabled
                />
                </div>

                { customer.status === 'active' &&

                    <div className="d-flex justify-content-end gap-2">
            
                    <button type="button" className="btn btn-secondary"
                        onClick={() => navigate(-1)} disabled={saving}>
                        Cancel
                    </button>

                    <button type="submit" className="btn btn-primary mx-2"
                        disabled={saving}>
                        {saving ? "Saving..." : "Update Customer"}
                    </button>

                    </div>

                }

            </form>
            </div>
        </div>
        </div>
    )
}

export default EditCustomerPage
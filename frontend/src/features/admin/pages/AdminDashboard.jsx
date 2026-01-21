import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const AdminDashboard = () => {

    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const loadCustomers = async () => {

        try{

            setLoading(true)

        } catch(error){

            if(error.status === 401){
                navigate('/unauthorized-access')
            }
            
            console.log(error)
            
        } finally{
            setLoading(false)
        }

    }


    useEffect(() => {
        loadCustomers()
    }, [])

    return (
        <div className="bg-light px-4 py-5">
            <div className="container-xl mx-auto">

                <div className="mb-4">
                    <h1 className="fw-bold text-dark fs-2">
                    Admin Dashboard
                    </h1>
                    <p className="text-secondary mt-1">
                    Operational overview and insights
                    </p>
                </div>

                <div className="mt-5 bg-white rounded-4 shadow p-4">
                    <h3 className="fw-semibold text-dark fs-4">
                    Manage Customers, and Orders
                    </h3>

                    <div className="row g-4 mt-3">
                        <div className="col-12 col-md-4">
                            <div
                            className="border rounded-4 p-3"
                            onClick={() => navigate('/admin/manage-customers')}
                            >
                            <p className="fs-5 fw-semibold text-dark m-0">
                                Manage Customers
                            </p>
                            </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div
                        className="border rounded-4 p-3"
                        onClick={() => navigate('/admin/manage-orders')}
                        >
                        <p className="fs-5 fw-semibold text-dark m-0">
                                Manage Orders
                        </p>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="mt-5 bg-white rounded-4 shadow p-4">

                    <h3 className="fw-semibold text-dark fs-4">
                    Manage Categories, and Products
                    </h3>

                    <div className="row g-4 mt-3">

                        <div className="col-12 col-md-6">
                            <div className="border rounded-4 p-3"
                            onClick={() => navigate('/admin/manage-category')}>

                                <p className="fs-5 fw-semibold text-dark m-0">
                                    Manage Categories
                                </p>

                            </div>
                        </div>

                        <div className="col-12 col-md-6">

                            <div className="border rounded-4 p-3"
                            onClick={() => navigate('/admin/manage-products')}>

                            <p className="fs-5 fw-semibold text-dark m-0">
                                    Manage Products
                            </p>

                            </div>
                            
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )

}

export default AdminDashboard
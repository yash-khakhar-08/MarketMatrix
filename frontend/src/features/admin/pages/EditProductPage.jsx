import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import { updateProduct } from "../services/product.service"

const EditProductPage = () => {

    const { state } = useLocation()

    const { productData } = state || null

    const navigate = useNavigate()
    const { token } = useSelector(state => state.auth)

    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)

    const [product, setProduct] = useState({
        id: "",
        productName: "",
        productDesc: "",
        productPrice: "",
        productQty: "",
        status: "",
        category: {}
    })

    const [imageFile, setImageFile] = useState(null)
    const [existingImage, setExistingImage] = useState("")

    useEffect(() => {
       
        if(!productData) return

        setProduct({
            id: productData.id,
            productName: productData.productName,
            productDesc: productData.productDesc,
            productPrice: productData.productPrice,
            productQty: productData.productQty,
            productImage: productData.productImage,
            status: productData.status,
            category: productData.category
        })

        setExistingImage(productData.productImage)

    }, [productData])

    const handleChange = e => {
        const { name, value } = e.target
        setProduct(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async e => {

        e.preventDefault()

        if(
            !product.productDesc?.trim() || 
            !product.productName?.trim() ||
            Number(product.productPrice) <=0 ||
            Number(product.productQty) < 0
        ){
            Swal.fire("Error", "Enter Proper Product Details!", "error")
            return
        }

        setSaving(true)

        const formData = new FormData()
        formData.append(
            "product",
            new Blob([JSON.stringify(product)], { type: "application/json" })
        )


        if (imageFile) {
            formData.append("image", imageFile)
        }

        try {

            await updateProduct(token, formData)

            Swal.fire("Updated", "Product updated successfully", "success")

            navigate("/admin/manage-products", {replace: true})

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
            <h4 className="mb-0">✏️ Edit Product</h4>
            </div>

            <div className="card-body">

            <form onSubmit={handleSubmit}>
                
                <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Section Name</label>
                    <input
                    type="text"
                    className="form-control"
                    value={product.category.sectionName}
                    disabled
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Category Name</label>
                    <input
                    type="text"
                    className="form-control"
                    value={product.category.catName}
                    disabled
                    />
                </div>
                </div>

                <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                    type="text"
                    name="productName"
                    className="form-control"
                    value={product.productName}
                    onChange={handleChange}
                    disabled={product.status !== 'active'}
                    required
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Current Price</label>
                    <input
                    type="number"
                    name="productPrice"
                    className="form-control"
                    value={product.productPrice}
                    onChange={handleChange}
                    disabled={product.status !== 'active'}
                    required
                    />
                </div>
                </div>

                <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                    name="productDesc"
                    className="form-control"
                    rows="3"
                    value={product.productDesc}
                    onChange={handleChange}
                    disabled={product.status !== 'active'}
                    required
                />
                </div>

                <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="form-label">Available Quantity</label>
                    <input
                    min="0"
                    type="number"
                    name="productQty"
                    className="form-control"
                    value={product.productQty}
                    onChange={handleChange}
                    disabled={product.status !== 'active'}
                    required
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label">Update Image (optional)</label>
                    <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])}
                    disabled={product.status !== 'active'}
                    />
                </div>
                </div>

                {existingImage && (
                <div className="mb-3">
                    <label className="form-label">Current Image</label>
                    <br />
                    <img
                    src={`${existingImage}`}
                    alt="product"
                    width="200"
                    style={{ borderRadius: "8px" }}
                    />
                </div>
                )}

                { product.status === 'active' &&

                    <div className="d-flex justify-content-end gap-2">
            
                    <button type="button" className="btn btn-secondary"
                        onClick={() => navigate(-1)} disabled={saving}>
                        Cancel
                    </button>

                    <button type="submit" className="btn btn-primary mx-2"
                        disabled={saving}>
                        {saving ? "Saving..." : "Update Product"}
                    </button>

                    </div>

                }

            </form>
            </div>
        </div>
        </div>
    )
}

export default EditProductPage
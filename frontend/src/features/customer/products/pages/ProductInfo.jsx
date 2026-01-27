import { useEffect, useMemo, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { addToCart } from "../../cart/services/cart.service"
import { setAuthData } from "../../../auth/authSlice"
import { fetchRelatedProducts } from "../services/product.service"
import ProductItem from "../../components/ProductItem"

const MAX_QTY = 3

const ProductInfo = () => {

    const { product = null, categoryId = null } = useLocation().state || {}
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { customer, cart = [], token } = useSelector(state => state.auth)

    const [qty, setQty] = useState(1)
    const [relatedProducts, setRelatedProducts] = useState([])

    useEffect(() => {
        if (!product || !categoryId) {
            navigate("/pageNotFound", { replace: true })
        }
    }, [product, categoryId, navigate])

    useEffect(() => {
        if (!product || !categoryId) return

        const loadRelatedProducts = async () => {
            try {
                const data = await fetchRelatedProducts(categoryId, product.id)
                setRelatedProducts(data)
            } catch (err) {
                console.error("Failed to load related products", err)
            }
        }

        loadRelatedProducts()
    }, [product, categoryId])

    const isInCart = useMemo(
        () => cart.some(item => item.product?.id === product?.id),
        [cart, product]
    )

    const increaseQuantity = () => {
        if(product.productQty === 0) return
        const max = Math.min(product.productQty, MAX_QTY)
        setQty(q => Math.min(q + 1, max))
    }

    const decreaseQuantity = () => {
        if(product.productQty === 0) return
        setQty(q => Math.max(q - 1, 1))
    }

    const handleAddToCart = async () => {

        if (!token || !customer) {
            navigate("/login")
            return
        }

        if(qty <= 0){
            alert("Product Quantity must be greater than 0")
            return
        }

        const payload = {
            productId: product.id,
            purchaseQty: qty,
            userId: customer.id
        }

        try {
            const newCartItem = await addToCart(token, payload)

            const updatedCart = [...cart, newCartItem]

            dispatch(setAuthData({
                token,
                customer,
                cart: updatedCart
            }))

            localStorage.setItem("customer", JSON.stringify({
                userDto: customer,
                cartList: updatedCart,
                token
            }))

            alert("Added to cart")

        } catch (err) {
            console.error("Add to cart failed", err)
        }
    }

    if (!product || !categoryId) {
        return null
    }

    return (
        <>
            <div className="container-fluid mt-4 p-4">
                <div className="row">
                    <div className="col-md-4 col-sm-6 col-12">
                        <img
                            src={`${product.productImage}`}
                            alt={product.productName}
                            style={{ height: 500, objectFit: "cover", width: "100%" }}
                        />
                    </div>

                    <div className="col-md-8 col-sm-6 col-12 d-flex flex-column justify-content-center">
                        <h3 className="text-primary fw-bold">{product.productName}</h3>
                        <p><strong>Price:</strong> ₹{product.productPrice}</p>
                        <p><strong>Description:</strong> {product.productDesc}</p>
                        <p><strong>Stock:</strong> {product.productQty} left</p>

                        <div className="d-flex align-items-center mt-3">
                            <strong>Select Quantity:</strong>
                            <div className="d-flex align-items-center mx-2">
                                <button className="btn btn-outline-secondary btn-sm" onClick={decreaseQuantity}>−</button>
                                <input
                                    readOnly
                                    className="form-control text-center mx-2"
                                    style={{ width: 60 }}
                                    value={qty}
                                />
                                <button className="btn btn-outline-secondary btn-sm" onClick={increaseQuantity}>+</button>
                            </div>
                        </div>

                        {isInCart ? (
                            <button className="btn btn-primary mt-3" onClick={() => navigate("/cart")}>
                                Go to Cart
                            </button>
                        ) : product.productQty === 0 ? 

                            <button className="btn btn-success mt-3">
                                Out Of Stock
                            </button> :

                            <button className="btn btn-success mt-3" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                            
                        }
                    </div>
                </div>
            </div>

            {relatedProducts?.productResponse && (
                <div className="container-fluid mt-4 p-4">
                    <h2 className="mb-4">Related Products</h2>
                    <div className="row">
                        <ProductItem
                            productItems={relatedProducts.productResponse}
                            categoryId={relatedProducts.id}
                        />
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductInfo

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { addToCart } from "../cart/services/cart.service"
import { setAuthData } from "../../auth/authSlice"

const MAX_QTY = 3

const ProductItem = ({ productItems, categoryId }) => {

    const [quantities, setQuantities] = useState({})

    const { customer, cart = [], token } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const updateCartState = (updatedCart) => {
        dispatch(setAuthData({ token, customer, cart: updatedCart }))
        localStorage.setItem("customer", JSON.stringify({
            userDto: customer,
            cartList: updatedCart,
            token
        }))
    }

    const handleQtyChange = (productId, value) => {
        const qty = Math.max(1, Math.min(Number(value), MAX_QTY))
        setQuantities(prev => ({ ...prev, [productId]: qty }))
    }

    const handleAddToCart = async (product) => {

        if (!token || !customer) {
            navigate("/login")
            return
        }

        const qty = quantities[product.id] || 1

        try {
            const newCartItem = await addToCart(token, {
                productId: product.id,
                purchaseQty: qty,
                userId: customer.id
            })

            updateCartState([...cart, newCartItem])

        } catch (err) {
            console.error("Add to cart failed", err)
        }
    }

    return (
        <>
            {productItems.map(product => {

                const qty = quantities[product.id] || 1
                const inCart = cart.some(item => item.product?.id === product.id)

                return (
                    <div key={product.id} className="col-md-3 col-sm-6 col-6 px-1 mb-3">
                        <div className="product-card">

                            <Link
                                to="/productInfo"
                                state={{ product, categoryId }}
                            >
                                <img
                                    src={`http://localhost:8080/products/${product.productImage}`}
                                    alt={product.productName}
                                    className="product-img"
                                />
                            </Link>

                            <div className="product-info">
                                <h5>{product.productName}</h5>
                                <p className="text-muted">
                                    Price: <strong>{product.productPrice}</strong> rs
                                </p>

                                <button
                                    className="btn btn-primary w-100"
                                    data-toggle="collapse"
                                    data-target={`#product_${product.id}`}
                                >
                                    More Info
                                </button>

                                <div className="collapse mt-2" id={`product_${product.id}`}>
                                    <p><strong>Stock:</strong> {product.productQty} left</p>

                                    <label>Select Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.productQty}
                                        value={qty}
                                        onChange={(e) =>
                                            handleQtyChange(product.id, e.target.value)
                                        }
                                        className="form-control mb-2"
                                    />

                                    {inCart ? (
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={() => navigate("/cart")}
                                        >
                                            Go to Cart
                                        </button>
                                    ) : product.productQty === 0 ? 

                                        <button className="btn btn-success w-100">
                                            Out Of Stock
                                        </button> :
                                        
                                        <button className="btn btn-success w-100"
                                            onClick={() => handleAddToCart(product)}>
                                            Add to Cart
                                        </button>
                                        
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default ProductItem
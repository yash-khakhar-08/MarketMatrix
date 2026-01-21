import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import '../../../../cart.css'
import { updateCartItemQuantity, removeCartItem } from "../services/cart.service"
import { setAuthData } from "../../../auth/authSlice"

const MAX_QTY = 3

const CartPage = () => {

    const {customer, cart, token} = useSelector(state => state.auth)

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const updateCartState = (updatedCart) => {
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
    }


    const handleQuantityChange = async (cartId, delta) => {

        const cartItem = cart.find(item => item.id === cartId)
        if (!cartItem) return

        const newQty = cartItem.purchaseQty + delta

        if (newQty < 1 || newQty > cartItem.product.productQty || newQty > MAX_QTY) return

        const updatedItem = {
            ...cartItem,
            purchaseQty: newQty,
            purchaseAmt: cartItem.product.productPrice * newQty
        }

        try {
            await updateCartItemQuantity(token, updatedItem)

            const updatedCart = cart.map(item =>
                item.id === cartId ? updatedItem : item
            )

            updateCartState(updatedCart)

        } catch (err) {
            console.error("Failed to update cart item ", err)
        }
    }


    const removeItem = (cartId) => {

        Swal.fire({
            title: "Are you sure? ",
            text: "You want to remove the product from cart?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, remove it!"
        }).then(async (result) => {
            if (result.isConfirmed) {

                try{

                    await removeCartItem(token, cartId)

                    const updatedCart = cart.filter(cartItem => cartItem.id !== cartId)

                    updateCartState(updatedCart)

                    Swal.fire("Deleted!", "Item has been removed.", "success")

                } catch(error){
                    console.log(error)
                }
                
            }
        })
        
    }

    const handleCheckout = () => {

        let stockAdjusted = false
        const updatedCart = cart.map(item => {
            if (item.purchaseQty > item.product.productQty) {
                stockAdjusted = true
                return {
                    ...item,
                    purchaseQty: 1,
                    purchaseAmt: item.product.productPrice
                }
            }
            return item
        })

        if (stockAdjusted) {
            Swal.fire({
                icon: 'info',
                title: 'Stock limit alert',
                text: 'Some items in your cart exceed available stock. Quantities have been adjusted accordingly.'
            })
        }

        updateCartState(updatedCart)
    
        navigate('/checkout')
    }


    return (
        cart && cart.length > 0 ? (
            <div className="container mt-2 mb-2 shpcart-container">
                <h2 className="text-center mb-4">🛒 Shopping Cart</h2>

                <div id="cartItems">
                    {cart.map((value) => (
                        <div key={value.id} className="cart-item d-flex align-items-center">
                            <Link
                                to="/productInfo"
                                state={{
                                    product: value.product,
                                    categoryId: value.categoryId
                                }}
                            >
                                <img
                                    src={`http://localhost:8080/products/${value.product.productImage}`}
                                    alt="Product"
                                />
                            </Link>

                            <div className="details">
                                <h5>{value.product.productName}</h5>

                                <p className="price">
                                    Product Price: <span>{value.product.productPrice}</span> rs
                                </p>

                                { value.product.productQty > 0 && 
                                <>

                                <div className="quantity-controls">
                                    <button
                                        className="btn btn-sm btn-light edit-cart"
                                        onClick={() => handleQuantityChange(value.id, -1)}
                                    >
                                        −
                                    </button>

                                    <input
                                        type="text"
                                        className="form-control mx-1"
                                        value={value.purchaseQty}
                                        readOnly
                                    />

                                    <button
                                        className="btn btn-sm btn-light edit-cart"
                                        onClick={() => handleQuantityChange(value.id, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="price">
                                    Subtotal: <span>{value.purchaseAmt}</span> rs
                                </p>

                                </>
                                }

                                { value.product.productQty === 0 && 
                                <div>
                                    <span className="remove-btn d-block">
                                    Out of Stock
                                    </span>
                                </div>
                                }

                                <span
                                    className="remove-btn mt-2 d-block"
                                    onClick={() => removeItem(value.id)}
                                >
                                    Remove
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary p-3 bg-white mt-3 shadow-sm d-flex justify-content-between align-items-center">
                    <h4>
                        Total:{' '}
                        <span className="text-danger grand-total">
                            {cart.reduce(
                                (sum, item) => sum + (item.product.productQty > 0 ? item.purchaseAmt : 0),
                                0
                            )}{' '}
                            rs
                        </span>
                    </h4>

                    <button className="btn btn-warning px-4 py-2" onClick={handleCheckout}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
            ) : (
                <div className="container mt-5">
                    <h2 className="text-center mb-4">🛒 Shopping Cart</h2>
                    <h2 className="text-center mb-4">No Cart Items | Go to Home</h2>
                </div>
            )
    )   
}

export default CartPage
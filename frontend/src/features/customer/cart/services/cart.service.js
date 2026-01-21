const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

export const updateCartItemQuantity = async (token, oldCartItem) => {

    await fetch(`${BACKEND_API_URL}/user/updateCart`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(oldCartItem)
    })

}

export const removeCartItem = async (token, cartId) => {

    await fetch(`${BACKEND_API_URL}/user/deleteFromCart`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cartId })
    })

}

export const addToCart = async (token, payload) => {

    const response = await fetch(`${BACKEND_API_URL}/user/addToCart`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })

    const data = await response.json()

    return data

}
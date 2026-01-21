const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

export const fetchOrders = async (token, userId) => {

    const response = await fetch(`${BACKEND_API_URL}/user/getAllOrders`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
    })

    const data = await response.json()

    return data

}

export const cancelOrder = async (token, orderId) => {

    await fetch(`${BACKEND_API_URL}/user/canelOrder`,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId })
    }) 

}

export const makeOrder = async (token, userId, paymentMode) => {

    await fetch(`${BACKEND_API_URL}/user/placeOrder`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, paymentMode })

    })

}
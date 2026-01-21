const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

export const fetchAllOrders = async (token) => {

    const response = await fetch(`${BACKEND_API_URL}/admin/getAllOrders`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    const data = await response.json()

    if(response.ok){
        return data
    } else{
        throw new Error(data.message)
    }

}

export const updateOrderStatus = async (token, payload) => {

    const response = await fetch(`${BACKEND_API_URL}/admin/updateOrderStatus`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })

    const data = await response.json()

    if(response.ok){
        return data
    } else{
        throw new Error(data.message)
    }

}
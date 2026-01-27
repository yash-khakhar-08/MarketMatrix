const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

export const addProduct = async (token, payload) => {

    const response = await fetch(`${BACKEND_API_URL}/admin/addProduct`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: payload
    })

    if(response.status === 401){
        throw new Error('Your session is over. Please login again.')
    } else if(response.status !== 200){
        throw new Error('Internal Server Error.')
    }

}

export const fetchAllProducts = async (token) => {

    const response = await fetch(`${BACKEND_API_URL}/admin/getAllProducts`, {
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

export const deleteProduct = async (token, payload) => {

    const response = await fetch(`${BACKEND_API_URL}/admin/deleteProduct`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message)
    }

}

export const updateProduct = async (token, payload) => {

    const response = await fetch(`${BACKEND_API_URL}/admin/updateProduct`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: payload
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message)
    }

}
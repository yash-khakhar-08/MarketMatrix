const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

export const fetchAllProducts = async (payload) => {

    const response = await fetch(`${BACKEND_API_URL}/getProducts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    const data = await response.json()

    return data

}

export const fetchRelatedProducts = async (categoryId, productId) => {

    const response = await fetch(`${BACKEND_API_URL}/getRelatedProducts`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: categoryId,
            productId
        })
    })

    const data = await response.json()

    return data

}

export const filterProducts = async (searchTerm) => {

    const response = await fetch(`${BACKEND_API_URL}/filterProducts/${searchTerm}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message)
    }

    return data

}
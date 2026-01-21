const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

export const fetchCategories = async (token) => {

    const response = await fetch(`${BACKEND_API_URL}/admin/getCategory`,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if(response.ok){
        const data = await response.json()
        return data
    } else if(response.status === 401){
        throw new Error('Your session is over. Please login again.')
    } else{
        throw new Error('Internal Server Error.')
    }
}

export const addCategory = async (token, payload) => {

    const response = await fetch(`${BACKEND_API_URL}/admin/addCategory`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            
        },
        body: JSON.stringify(payload)
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message);
    }

}

export const deleteCategory = async (token, payload) => {

    const response = await fetch(`${BACKEND_API_URL}/admin/deleteCategory`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            
        },
        body: JSON.stringify(payload)
    })
    
    const data = await response.json()

    if(!response.ok){

        throw new Error(data.message);
    }

}
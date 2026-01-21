const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

export const fetchAllCustomers = async (token) => {

    const response = await fetch(`${BACKEND_API_URL}/admin/getAllCustomers`, {
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

export const deleteCustomer = async (token, payload) => {

    const response = await fetch(`${BACKEND_API_URL}/admin/deleteCustomer`, {
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

export const updateCustomer = async (token, payload) => {

    const response = await fetch(`${BACKEND_API_URL}/admin/updateCustomer`, {
        method: 'PUT',
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
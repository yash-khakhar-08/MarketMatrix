const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

export const saveAddress = async (token, payload) => {

    await fetch(`${BACKEND_API_URL}/user/saveAddress`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    })

}

export const updateProfile = async (token, payload) => {

    const response = await fetch(`${BACKEND_API_URL}/user/updateProfile`,{
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
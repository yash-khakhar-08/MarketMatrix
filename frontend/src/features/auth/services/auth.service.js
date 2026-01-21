const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL

export const register = async (payload) => {

    const response = await fetch(`${BACKEND_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message)
    }

}

export const login = async (payload) => {

    const response = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message)
    }

    return data

}
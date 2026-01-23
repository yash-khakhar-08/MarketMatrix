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

export const verifyEmail = async (payload) => {

    const response = await fetch(`${BACKEND_API_URL}/api/auth/verifyEmail`, {
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

export const verifyOtpCode = async (payload) => {

    const response = await fetch(`${BACKEND_API_URL}/api/auth/verifyOtpCode`, {
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

export const changePassword = async (payload) => {

    const response = await fetch(`${BACKEND_API_URL}/api/auth/updatePassword`, {
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

export const verifyAccount = async (payload) => {

    const response = await fetch(`${BACKEND_API_URL}/api/auth/verifyAccount`, {
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
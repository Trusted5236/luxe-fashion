import {SignupPayload, User, loginPayload, requestPasswordPayload, resetPassword} from '../types/index.ts'



const BASE_URL = import.meta.env.VITE_BASE_URL ?? "https://luxe-fashion-backend.onrender.com/api"

console.log('🔍 Checking environment:');
console.log('VITE_BASE_URL:', import.meta.env.VITE_BASE_URL);
console.log('Final BASE_URL:', BASE_URL);

const getToken = (): string | null =>{
    return localStorage.getItem('accessToken')
}
const setToken = (token : string): void=>{
    localStorage.setItem("accessToken", token)
}
const removeToken = (): void =>{
    localStorage.removeItem("accessToken")
}


export const signup = async (userData: SignupPayload) =>{
    const response = await fetch(`${BASE_URL}/auth`, {
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json',
        }, 
        body: JSON.stringify(userData)
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || "Signup failed")
    }

    if(data){
        setToken(data)
    }
    return data
}

export const getProfile = async ()=>{
    const token = getToken()

    if(!token){
        throw new Error('No token found. Please login')
    }

    const response = await fetch(`${BASE_URL}/auth/profile`, { 
        method : "GET",
        headers : {
            'Content-Type' : 'application/json',
            'Authorization' : `Bearer ${token}`
        },
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || 'Failed to get profile')
    }

    return data
}

export const loginApi = async (userData : loginPayload)=>{
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json',
        }, 
        body: JSON.stringify(userData)
    })

    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || "Login failed")
    }

    if(data){
        setToken(data)
    }
    return data
}

export const requestPasswordReset = async (userData : requestPasswordPayload) =>{
    const response = await fetch(`${BASE_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json',
        }, 
        body: JSON.stringify(userData)
    })
    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || "Request password reset failed")
    }
    return data
}

export const resetPasswordApi = async (userData : resetPassword) =>{
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json',
        }, 
        body: JSON.stringify(userData)
    })
    const data = await response.json()

    if(!response.ok){
        throw new Error(data.message || "Reset password failed")
    }
    return data
}
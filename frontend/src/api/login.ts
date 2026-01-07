import apiClient from './client'
import { FromData } from '../types'

export const loginUser = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login/', {
        username: email,
        password: password,
    })
    return response.data
}

export const registerUser = async (formData: FromData) => {
    const response = await apiClient.post('/auth/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name
    })
    return response.data
}


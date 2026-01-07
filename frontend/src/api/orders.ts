import apiClient from './client'
import { Order } from '../types'

export const createOrder = async (orderData: {
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  status?: string
}): Promise<Order> => {
  const response = await apiClient.post('/orders/create_order/', orderData)
  return response.data
}

export const getOrders = async (): Promise<Order[]> => {
  const response = await apiClient.get('/orders/')
  return response.data.results || response.data
}

export const updateOrderStatus = async (orderId: number, status: string): Promise<Order> => {
  const response = await apiClient.patch(`/orders/${orderId}/`, { status })
  return response.data
}

export const setOrderStatus = async (orderId: number, status: string): Promise<Order> => {
  const response = await apiClient.post(`/orders/${orderId}/set_status/`, { status })
  return response.data
}



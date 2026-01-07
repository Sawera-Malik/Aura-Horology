import apiClient from './client'
import { Product, Category } from '../types'

export const getCategories = async (): Promise< Category[] > => {
  const response = await apiClient.get('/categories/')
  console.log('API Response for Categories:', response.data.results)
  return response?.data?.results
}

export const getProducts = async (category?: string, search?: string): Promise<Product[]> => {
  const params = new URLSearchParams()
  if (category) params.append('category', category)
  if (search) params.append('search', search)
  
  const response = await apiClient.get(`/products/?${params.toString()}`)
  return response.data.results || response.data
}

export const getProduct = async (id: number): Promise<Product> => {
  const response = await apiClient.get(`/products/${id}/`)
  return response.data
}

export const getProductReviews = async (id: number) => {
  const response = await apiClient.get(`/products/${id}/reviews/`)
  return response.data
}


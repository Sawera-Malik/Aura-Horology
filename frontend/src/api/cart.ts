import apiClient from './client'
import { Cart, PaymentPayload } from '../types'

export const getCart = async (): Promise<Cart> => {
  const response = await apiClient.get('/cart/my_cart/')
  return response.data
}

export const addToCart = async (productId: number, quantity: number = 1) => {
  const response = await apiClient.post('/cart/add_item/', {
    product_id: productId,
    quantity,
  })
  return response.data
}

export const updateCartItem = async (itemId: number, quantity: number) => {
  const response = await apiClient.post('/cart/update_item/', {
    item_id: itemId,
    quantity,
  })
  return response.data
}

export const removeFromCart = async (itemId: number) => {
  const response = await apiClient.post('/cart/remove_item/', {
    item_id: itemId,
  })
  return response.data
}

export const createPaymentIntent = async () => {
  const response = await apiClient.post('/cart/create_payment_intent/',
    
  )
  return response.data
}


export const createCheckoutPayment = async (payload:PaymentPayload) => {


  const response = await apiClient.post('/cart/create_payment_intent/', payload);
  console.log('Backend response status:', response);
  const data = await response.data;

  if (!response.statusText || response.statusText !== 'OK') {
    console.log('Backend error response:', data);
  }

  return data;
};


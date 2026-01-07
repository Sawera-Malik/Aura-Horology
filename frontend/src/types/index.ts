export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string | null
  created_at: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: string
  compare_at_price: string | null
  category: Category
  image: string | null
  stock: number
  is_active: boolean
  rating: string
  num_reviews: number
  discount_percentage: number
  created_at: string
}

export interface Review {
  id: number
  product: number
  user: string
  rating: number
  comment: string
  created_at: string
}

export interface CartItem {
  id: number
  product: Product
  quantity: number
  subtotal: string
  created_at: string
}

export interface Cart {
  id: number
  user: number | null
  items: CartItem[]
  total_price: string
  created_at: string
  updated_at: string
  total_items: number
  status: string
}

export interface OrderItem {
  id: number
  product: Product
  quantity: number
  price: string
  subtotal: string
}

export interface Order {
  id: number
  user: number | null
  status: string
  total_price: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}


export interface FromData {
  username: string
  email: string
  password: string
  first_name: string
  last_name: string
}

export interface PaymentPayload {
   amount: number,
      currency: string,
      payment_method: string,
      receipt_email: string,
      shipping_name: string,
      shipping_line1: string,
      shipping_city: string,
      shipping_state: string,
      shipping_postal_code: string,
      shipping_country: string,
      connected_account_id: string | null,
      vendor_id: number,
     transaction_id: string | null, 
     // voucher_code: "LGKPYTJNP3",
      promotion_code: string
} 
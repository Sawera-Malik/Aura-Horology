import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, updateCartItem, removeFromCart } from '../api/cart'
import { Cart as CartType } from '../types'

const Cart = () => {
  const [cart, setCart] = useState<CartType | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const cartData = await getCart()
      console.log('Cart data:', cartData)
      setCart(cartData)
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      await updateCartItem(itemId, newQuantity)
      await loadCart()
    } catch (error) {
      console.error('Failed to update cart:', error)
      alert('Failed to update cart item')
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    if (window.confirm('Remove this item from cart?')) {
      try {
        await removeFromCart(itemId)
        await loadCart()
      } catch (error) {
        console.error('Failed to remove item:', error)
        alert('Failed to remove item')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some products to get started!</p>
        <Link to="/products" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    )
  }
console.log('Cart is empty', cart)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="card p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/products/${item.product.id}`} className="flex-shrink-0">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-32 h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                  )}
                </Link>
                <div className="flex-grow">
                  <Link to={`/products/${item.product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-accent">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-text/70 text-sm mb-4 line-clamp-2">
                    {item.product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-accent">
                        ${parseFloat(item.product.price).toFixed(2)}
                      </p>
                      <p className="text-sm text-text/50">
                        Subtotal: ${parseFloat(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  ${parseFloat(cart.total_price).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Items</span>
                <span className="font-semibold">
                  {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-accent">
                    ${parseFloat(cart.total_price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout', { state: { amount: Math.round(parseFloat(cart.total_price)) } })} // Pass the subtotal
              className="btn-primary w-full py-3"
            >
              Proceed to Checkout
            </button>
            <Link
              to="/products"
              className="block text-center mt-4 text-accent hover:text-accent/80"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

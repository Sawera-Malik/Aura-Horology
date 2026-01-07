import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct, getProductReviews } from '../api/products'
import { addToCart } from '../api/cart'
import { Product, Review } from '../types'
import { useAuth } from '../context/AuthContext'

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState(false)
   const { user } = useAuth()

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    if (!id) return
    setLoading(true)
    try {
      const [productData, reviewsData] = await Promise.all([
        getProduct(parseInt(id)),
        getProductReviews(parseInt(id)),
      ])
      setProduct(productData)
      setReviews(reviewsData)
    } catch (error) {
      console.error('Failed to load product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    setAddingToCart(true)
    try {
      await addToCart(product.id, quantity)
      if(user){
        navigate('/cart')
      }else{
        navigate('/login')
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
      alert('Failed to add product to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">Product not found.</p>
      </div>
    )
  }
  console.log(product, 'hjbhjb')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="card">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-accent">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            {product.compare_at_price && (
              <span className="text-xl text-text/50 line-through">
                ${parseFloat(product.compare_at_price).toFixed(2)}
              </span>
            )}
            {product.discount_percentage > 0 && (
              <span className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                -{product.discount_percentage}% OFF
              </span>
            )}
          </div>

          {product?.rating && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="text-lg">
                {parseFloat(product.rating).toFixed(1)} ({product.num_reviews} reviews)
              </span>
            </div>
          )}

          <p className="text-text/70 mb-6">{product.description}</p>

          <div className="mb-6">
            <p className="text-sm text-text/50 mb-2">
              Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </p>
          </div>

          {product.stock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center bg-transparent"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn-primary w-full py-3 disabled:opacity-50"
              >
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          ) : (
            <button disabled className="btn-secondary w-full py-3 opacity-50 cursor-not-allowed">
              Out of Stock
            </button>
          )}
        </div>
      </div>

      {reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="card p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{review.user}</span>
                    <div className="flex text-yellow-400">
                      {'★'.repeat(review.rating)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && <p className="text-gray-700">{review.comment}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail

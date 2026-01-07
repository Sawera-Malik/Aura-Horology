import { Link } from 'react-router-dom'
import { Product } from '../types'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/products/${product.id}`} className="card block">
      <div className="relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-card flex items-center justify-center">
            <span className="text-text/50">No Image</span>
          </div>
        )}
        {product.discount_percentage > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            -{product.discount_percentage}%
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-text/70 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-accent">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            {product.compare_at_price && (
              <span className="ml-2 text-sm text-text/50 line-through">
                ${parseFloat(product.compare_at_price).toFixed(2)}
              </span>
            )}
          </div>
          {product?.rating && (
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="ml-1 text-sm text-text/70">
                {parseFloat(product.rating).toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard


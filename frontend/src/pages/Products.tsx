import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCategories, getProducts } from '../api/products'
import { Category, Product } from '../types'
import ProductCard from '../components/ProductCard'

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [selectedCategory, searchQuery])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      console.log('Categories:', data)
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await getProducts(
        selectedCategory || undefined,
        searchQuery || undefined
      )
      setProducts(data)

      const params = new URLSearchParams()
      if (selectedCategory) params.set('category', selectedCategory)
      if (searchQuery) params.set('search', searchQuery)
      setSearchParams(params)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug === selectedCategory ? '' : slug)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadProducts()
  }

  console.log('Selected Category:', categories)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="mb-8 space-y-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${!selectedCategory
                ? 'bg-accent text-primary'
                : 'bg-card text-text hover:bg-card/80'
              }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedCategory === category.slug
                  ? 'bg-accent text-primary'
                  : 'bg-card text-text hover:bg-card/80'
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      )}
    </div>
  )
}

export default Products


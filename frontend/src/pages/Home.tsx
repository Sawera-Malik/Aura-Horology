import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, getProducts } from '../api/products'
import { Category, Product } from '../types'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { accessToken, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (accessToken) {
      loadData()
    } else {
      setLoading(false) // If no token, stop loading
    }
  }, [accessToken])

  const loadData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts(),
      ])
      console.log('Categories:', categoriesData)
      console.log('Products:', productsData)
      setCategories(categoriesData)
      setFeaturedProducts(productsData.slice(0, 8))
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-primary text-text py-20 bg-cover bg-center" style={{ backgroundImage: `url(https://cdn6.f-cdn.com/contestentries/977833/23488134/58d58d670cb50_thumb900.jpg)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Aura Horology
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-text/80">
            Discover amazing products at unbeatable prices
          </p>
          <Link to="/products" className="btn-primary inline-block">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="card text-center p-6 hover:scale-105 transition-transform"
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 object-cover rounded mb-4"
                  />
                )}
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-accent hover:text-accent/80 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home


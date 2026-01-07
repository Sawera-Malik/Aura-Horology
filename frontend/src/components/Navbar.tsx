import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCart } from '../api/cart'
import { Cart } from '../types'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  useEffect(() => {
    // Only load cart if not staff? Or always?
    // Original code loaded it always but only displayed if !is_staff
    // Safe to load always or check !isStaff
    if (!user?.is_staff) {
      loadCart()
    }
  }, [getCart, user])

  const loadCart = async () => {
    try {
      const cartData = await getCart()
      setCart(cartData)
    } catch (error) {
      console.error('Failed to load cart:', error)
    }
  }

  const handleCardClick = () => {
    if (user) {
      navigate('/cart')
    } else {
      navigate('/login')
    }
  }
  const handleLogoutModalClose = () => {
    setLogoutModalOpen(false)
  }
  const handleLogoutModalOpen = () => {
    setLogoutModalOpen(true)
  }
  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    setLogoutModalOpen(false)
    navigate('/')
  }

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
  const isStaff = user?.is_staff

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="bg-card shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-accent">
              Aura Horology
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!isStaff ? (
              <>
                <Link to="/" className={`transition-colors ${isActive('/') ? 'text-accent font-bold' : 'text-text hover:text-accent '}`}>
                  Home
                </Link>
                <Link to="/products" className={`transition-colors ${isActive('/products') ? 'text-accent font-bold' : 'text-text hover:text-accent'}`}>
                  Products
                </Link>
              </>
            ) : (
              <Link to="/admin" className={`transition-colors ${isActive('/admin') ? 'text-accent font-bold' : 'text-text hover:text-accent'}`}>
                Admin Dashboard
              </Link>
            )}

            <Link to="/about" className={`transition-colors ${isActive('/about') ? 'text-accent font-bold' : 'text-text hover:text-accent'}`}>
              About
            </Link>

            {!isStaff && user && (
              <Link to="/orders" className={`transition-colors ${isActive('/orders') ? 'text-accent font-bold' : 'text-text hover:text-accent'}`}>
                My Orders
              </Link>
            )}

            {user ? (
              <button onClick={handleLogoutModalOpen} className="text-text hover:text-accent transition-colors">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-text hover:text-accent transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-text hover:text-accent transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Actions (Cart / Mobile Menu Toggle) */}
          <div className="flex items-center">
            {/* Cart Icon - Only for non-staff */}
            {!isStaff && (
              <span
                onClick={handleCardClick}
                className={`hidden md:flex items-center relative ${isActive('/cart') ? 'text-accent font-bold' : 'text-text hover:text-accent'} hover:text-accent transition-colors cursor-pointer mr-4`}
              >
                <ShoppingCartOutlined style={{ fontSize: 30 }} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </span>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-text p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-gray-100">
            {!isStaff ? (
              <>
                <Link
                  to="/"
                  className={`block ${isActive('/') ? 'text-accent font-bold' : 'text-text hover:text-accent font-bold'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className={`block ${isActive('/products') ? 'text-accent font-bold' : 'text-text hover:text-accent'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                {user && (
                  <Link
                    to="/orders"
                    className={`block ${isActive('/orders') ? 'text-accent font-bold' : 'text-text hover:text-accent'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/admin"
                className={`block ${isActive('/admin') ? 'text-accent font-bold' : 'text-text hover:text-accent'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}

            <Link
              to="/about"
              className={`block ${isActive('/about') ? 'text-accent font-bold' : 'text-text hover:text-accent'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {!isStaff && (
              <Link
                to="/cart"
                className={`block ${isActive('/cart') ? 'text-accent font-bold' : 'text-text hover:text-accent'} relative`}
                onClick={() => setIsMenuOpen(false)}
              >
                Cart
                {cartItemCount > 0 && (
                  <span className="ml-2 bg-accent text-primary text-xs rounded-full px-2 py-1">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <button
                className="block text-text hover:text-accent text-left w-full"
                onClick={handleLogoutModalOpen}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-text hover:text-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-text hover:text-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      {logoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-md shadow-md max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleLogoutModalClose}
                className="px-4 py-2 bg-gray-400 text-text rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

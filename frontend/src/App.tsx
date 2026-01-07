import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Footer from './components/Footer'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuth } from './context/AuthContext'
import AdminDashboard from './adminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import CheckoutPage from './pages/Checkout'

function App() {
  const { user } = useAuth()
  const location = useLocation()

  if (user && user.is_staff && location.pathname === '/') {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes >
             
             
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes - Admin cannot access */}
              <Route element={<ProtectedRoute userOnly={true} />}>
               <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<Orders />} />
              </Route>

              {/* Admin Routes - User cannot access */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
  )
}

export default App


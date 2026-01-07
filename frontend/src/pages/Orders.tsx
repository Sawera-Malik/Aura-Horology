import { useEffect, useState } from 'react'
import { getOrders } from '../api/orders'
import { Order } from '../types'
import { Link } from 'react-router-dom'

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadOrders()
    }, [])

    const loadOrders = async () => {
        try {
            const data = await getOrders()
            setOrders(data)
            console.log("User Orders:", data)
        } catch (error) {
            console.error('Failed to load orders:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">My Orders</h1>
                <p className="text-text/70 mb-8">You haven't placed any orders yet.</p>
                <Link to="/products" className="btn-primary inline-block">
                    Start Shopping
                </Link>
            </div>
        )
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'processing': return 'bg-blue-100 text-blue-800'
            case 'shipped': return 'bg-purple-100 text-purple-800'
            case 'delivered': return 'bg-green-100 text-green-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            <div className="space-y-6">
                {orders.map((order) => (
                    <div key={order.id} className="bg-card shadow rounded-lg overflow-hidden border border-card">
                        <div className="px-6 py-4 bg-primary border-b border-card flex flex-wrap justify-between items-center">
                            <div>
                                <p className="text-sm text-text/50">Order Placed</p>
                                <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-text/50">Total</p>
                                <p className="font-medium">${parseFloat(order.total_price).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Order #</p>
                                <p className="font-medium">{order.id}</p>
                            </div>
                            <div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>
                        <div className="px-6 py-4">
                            <ul className="divide-y divide-gray-200">
                                {order.items.map((item) => (
                                    <li key={item.id} className="py-4 flex">
                                        {item.product.image && (
                                            <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                                                <img
                                                    src={item.product.image}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-center object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="ml-4 flex-1 flex flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-white">
                                                    <h3>
                                                        <Link to={`/products/${item.product.id}`}>{item.product.name}</Link>
                                                    </h3>
                                                    <p className="ml-4">${parseFloat(item.price).toFixed(2)}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.product.description}</p>
                                            </div>
                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                <p className="text-gray-500">Qty {item.quantity}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Orders

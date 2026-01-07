import { useEffect, useState } from 'react'
import { getOrders, updateOrderStatus } from '../api/orders'
import { Order } from '../types'

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
        } catch (error) {
            console.error('Failed to load orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus)
            await loadOrders() // Reload to reflect changes
        } catch (error) {
            console.error('Failed to update status:', error)
            alert('Failed to update order status')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-text/70 text-lg">No orders found.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-card rounded-lg overflow-hidden">
                <thead className="bg-card">
                    <tr>
                        <th className="px-6 py-3 text-left text-xl font-medium text-text uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xl font-medium text-text uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xl font-medium text-text uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xl font-medium text-text uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xl font-medium text-text uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xl font-medium text-text uppercase tracking-wider">Items</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-card">
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">#{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text/70">
                                {order.first_name} {order.last_name}
                                <br />
                                <span className="text-xs">{order.email}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text/70">
                                {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text/70">
                                ${parseFloat(order.total_price).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text/70">
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    className="mt-1 block w-full py-2 px-3 border border-card bg-card rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 text-sm text-text/70">
                                <div className="max-h-20 overflow-y-auto">
                                    {order.items.map((item) => (
                                        <div key={item.id}>
                                            {item.quantity}x {item.product.name}
                                        </div>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Orders

import  { useEffect, useState } from 'react'
import { getCart } from '../api/cart'
import { Cart as CartType } from '../types'
import moment from 'moment';

function Dashboard() {
    const [cart, setCart] = useState<CartType | null>(null)

    useEffect(() => {
        loadCart()
    }, [])
    console.log('Dashboard cart:', cart)

    const loadCart = async () => {
        try {
            const cartData = await getCart()
            setCart(cartData)
        } catch (error) {
            console.error('Failed to load cart:', error)
        }
    }
    return (
        <div>

            <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
                <div className='card p-6 px-8'>
                    <h2 className="text-2xl font-bold mb-4">Total Revenue</h2>
                    <p className="text-xl font-medium text-text/70">$ {cart?.total_price}</p>
                </div>
                <div className='card p-6 px-8'>
                    <h2 className="text-2xl font-bold mb-4">Total Orders</h2>
                    <p className="text-xl font-medium text-text">{cart?.total_items}</p>
                </div>
                <div className='card p-6 px-8'>
                    <h2 className="text-2xl font-bold mb-4">Total Products</h2>
                    <p className="text-xl font-medium text-text">6</p>
                </div>
                <div className='card p-6 px-8'>
                    <h2 className="text-2xl font-bold mb-4">Pending Orders</h2>
                    <p className="text-xl font-medium text-text">0</p>
                </div>
            </div>
            <div className='card p-6 px-8 mt-8'>
                <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                {cart && cart.items.length > 0 ? (
                    <table className="w-full mb-6 border border-card rounded-lg overflow-hidden shadow-sm">
                        <thead className="bg-card">
                            <tr>
                                <th className="px-4 py-3 text-left text-xl font-semibold text-text"> Order ID</th>
                                <th className="px-4 py-3 text-left text-xl font-semibold text-text"> Product Name </th>
                                <th className="px-4 py-3 text-left text-xl font-semibold text-text"> Order Date</th>
                                <th className="px-4 py-3 text-left text-xl font-semibold text-text"> Quantity</th>
                                <th className="px-4 py-3 text-left text-xl font-semibold text-text">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cart.items.map((item, index) => (
                                <tr key={index} className="border-t border-slate-700 hover:bg-primary transition">
                                    <td className="px-4 py-3 text-md text-text/70">{item.product.id}</td>
                                    <td className="px-4 py-3 text-md text-text/70"> {item.product.name}</td>
                                    <td className="px-4 py-3 text-md text-text/70">    {item.created_at ? moment(item.created_at).format('YYYY-MM-DD') : '-'}</td>
                                    <td className="px-4 py-3 text-md text-text/70">  {item.quantity} </td>
                                    <td className="px-4 py-3 text-md text-text/70">  ${item.subtotal} </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ):(
                <p className="text-text">No recent orders</p>
                )}
            </div>
        </div>
    )
}

export default Dashboard



import React, { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; 

export default function PaymentComponent() {
  const [orders, setOrders] = useState([]);
  const [orderName, setOrderName] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCreateOrder = () => {
    if (!orderName.trim()) return alert("Enter order name first");
    const newOrder = {
      id: uuidv4(), 
      name: orderName.trim(),
    };
    setOrders((prev) => [...prev, newOrder]);
    setOrderName("");
    setSelectedOrder(newOrder.id);
  };

  const handlePayment = async () => {
    if (!selectedOrder) return alert("Select an order first");

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.post(
        "https://clear-logical-kangaroo.ngrok-free.app/api/payments/create-payment/",
        {
          transaction_id: "628b20d2-89ca-4339-b8bf-f530e1657165",
          payment_method: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto border rounded shadow space-y-4 mt-4" style={{padding: '20px', border: '1px solid black', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
      <h2 className="text-xl font-semibold">E-commerce Orders & Payment</h2>

      <div className="flex space-x-2">
        <input
          type="text"
          value={orderName}
          onChange={(e) => setOrderName(e.target.value)}
          placeholder="Enter order name"
          className="flex-1 border p-6 rounded"
        />
        <button
          onClick={handleCreateOrder}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Order
        </button>
      </div>
      {orders && (
        <ul className="list-disc list-inside">
          {orders.map((order) => (
            <li key={order.id}>
              {order.name} 
            </li>
          ))}
        </ul>
      )}

      <div>
        <label className="block font-medium mb-1">Select Order</label>
        <select
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Choose an Order --</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
               {order.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="card">Card</option>
          <option value="paypal">PayPal</option>
          <option value="cod">Cash on Delivery</option>
        </select>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading || !selectedOrder}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {result && (
        <pre className="mt-4 p-2 bg-gray-100 rounded text-sm overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}

      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}

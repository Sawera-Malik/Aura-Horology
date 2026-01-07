// CheckoutForm.js
import React, { useState } from 'react';
import { createOrder } from '../api/orders';
import {
  CardElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'react-router-dom';
import { createCheckoutPayment } from '../api/cart';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#F8FAFC', // Off-White text
      '::placeholder': { color: '#64748B' }, // Slate Gray placeholder
    },
    invalid: { color: '#fa755a' },
  },
};

export function CheckoutForm({ amount: amountProp }: { amount?: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const CLIENT_ID = "acct_1SAQYtHrKPGKbjB0";

  // form fields
  const amount = amountProp;
  const [currency, setCurrency] = useState('usd');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('US');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!stripe || !elements) {
      setErrorMsg('Stripe has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMsg('Card element not found.');
      return;
    }

    setLoading(true);
console.log('Submitting payment with amount:', amount, 'currency:', currency);
    try {

      const paymentPayload = {
        amount: Number(amount),
        currency,
        payment_method: 'card',
        receipt_email: email,
        shipping_name: name,
        shipping_line1: line1,
        shipping_city: city,
        shipping_state: state,
        shipping_postal_code: postalCode.trim(),
        shipping_country: country,
        connected_account_id: CLIENT_ID,
        vendor_id: 10,
        transaction_id: "8cc089aa-0c34-4091-9570-1445c6f6bdcb",
        // voucher_code: "LGKPYTJNP3",
        promotion_code: "HTWC3URE"
      };

      const data = await createCheckoutPayment(paymentPayload);

      const clientSecret = data.clientSecret;
      if (!clientSecret) throw new Error('clientSecret not returned from backend.');

      const billing_details = {
        name,
        email,
        address: {
          line1,
          city,
          state,
          postal_code: postalCode,
          country: country.toUpperCase(),
        },
      };

      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details,
        },
      });

      if (confirmResult.error) {
        throw new Error(confirmResult.error.message);
      }

      if (confirmResult.paymentIntent?.status === 'succeeded') {
        setSuccessMsg(
          'Payment succeeded! PaymentIntent id: ' + confirmResult.paymentIntent.id
        );
        // Create order in backend and set its status to delivered
        try {
          const orderData = {
            first_name: name,
            last_name: name,
            email,
            phone: '03200000000',
            address: line1,
            city,
            state,
            zip_code: postalCode,
            country,
            status: 'delivered',
          };
          await createOrder(orderData);
        } catch (e) {
          console.error('Order creation failed', e);
        }
      }

    } catch (err: any) {
      setErrorMsg(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  }



  return (
    <form onSubmit={handleSubmit} className="p-8 border-stale-200 rounded-md max-w-4xl text-slate-900 w-full mx-auto my-10 space-y-6 bg-card">
      <div>
        <label className="block text-lg font-bold text-text mb-1">
          Amount (smallest unit, e.g., cents) — current: {amount}
        </label>
      </div>

      <div>
        <label className="block text-lg font-bold text-text mb-1">
          Currency
        </label>
        <input
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          placeholder='Add currency'
          className="w-full px-3 py-2 border border-card  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-lg font-bold text-text mb-1">
          Full name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder='What is your Fullname'
          className="w-full px-3 py-2 border border-card rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-lg font-bold text-text mb-1">
          Email (receipt)
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder='What is you Email'
          className="w-full px-3 py-2 border border-card rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-lg font-bold text-text mb-1">
          Address line 1
        </label>
        <input
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          placeholder="Address Line 1"
          className="w-full px-3 py-2 border border-card rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </div>

      <div className="flex gap-2">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="flex-1 px-3 py-2 border border-card rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
        <input
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="State"
          className="flex-1 px-3 py-2 border border-card rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </div>

      <div className="flex gap-2">
        <input
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Postal Code"
          className="flex-1 px-3 py-2 border border-card rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          className="flex-1 px-3 py-2 border border-card rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </div>

      <div>
        <label className="block text-lg font-bold text-text mb-1">
          Card details
        </label>
        <div className="p-3 border border-card rounded-md">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-accent text-primary py-2 px-4 rounded-md hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Pay'}
      </button>

      {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}
      {successMsg && <div className="text-success text-sm">{successMsg}</div>}

      <small className="text-text/50 text-xs">
        Test card: <code>4242 4242 4242 4242</code>, any future expiry, CVC <code>123</code> (test mode only).
      </small>
    </form>
  );
}
const stripePromise = loadStripe("pk_test_51SAAOkIXSPJSSn7hXkOPhUAeW3ipVJDULGEOUg0z54DwZhJ5zopxmUXjpPw9zmajQGQ5yk8qH3bZ3HMtqiRxx8YO00SH9bbSdo");
export default function CheckoutPage() {
  const location = useLocation();
  const amount = location.state?.amount || 5000;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
}

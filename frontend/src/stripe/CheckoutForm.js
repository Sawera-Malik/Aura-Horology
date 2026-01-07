// CheckoutForm.js
import React, { useState } from 'react';
import {
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': { color: '#a0aec0' },
    },
    invalid: { color: '#fa755a' },
  },
};

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const CLIENT_ID = "acct_1SAQYtHrKPGKbjB0";


  // form fields
  const [amount, setAmount] = useState(5000);
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

  const validatePostal = (countryCode, code) => {
    if (!code || code.trim() === '') return false;
    // very simple country-based checks (adjust if you need stricter validation)
    if (countryCode?.toLowerCase() === 'us') return /^\d{5}(-\d{4})?$/.test(code.trim());
    if (countryCode?.toLowerCase() === 'pk') return /^\d{5}$/.test(code.trim());
    // default: accept non-empty
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // if (!stripe || !elements) {
    //   setErrorMsg('Stripe has not loaded yet.');
    //   return;
    // }
    // if (!validatePostal(country, postalCode)) {
    //   setErrorMsg('Please enter a valid postal code for country: ' + country);
    //   return;
    // }

      const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMsg('Card element not found.');
      return;
    }

    setLoading(true);

    try {

      const token = localStorage.getItem('accessToken');
      const res = await fetch('https://clear-logical-kangaroo.ngrok-free.app/api/payments/create-payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
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
          // voucher_code: "LGKPYTJNP3"
          promotion_code: "HTWC3URE"
        }),
      });

      const data = await res.json();
      console.log('create-payment response', { postalCode, name, line1, city, state, country, amount, currency }, data);

    if (!res.ok) {
  console.log('Backend error response:', data);
  if (data?.voucher_error) {
    throw new Error('Voucher Error: ' + data.voucher_error);
  }
  throw new Error(data.detail || data.error || data.message || JSON.stringify(data));
}

      console.log('data', data);


      const clientSecret = data.client_secret || data.client_secret;
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

      console.log('confirmResult', confirmResult, clientSecret);

      if (confirmResult.error) {
        throw new Error(confirmResult.error.message);
      }

      if (confirmResult.paymentIntent && confirmResult.paymentIntent.status === 'succeeded') {
        setSuccessMsg('Payment succeeded! PaymentIntent id: ' + confirmResult.paymentIntent.id);
      } else {
        setSuccessMsg('Payment processing. Status: ' + (confirmResult.paymentIntent?.status ?? 'unknown'));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  }



  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
      <label>
        Amount (smallest unit, e.g., cents) — current: {amount}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          style={{ width: '100%', padding: 8 }}
        />
      </label>

      <label>
        Currency
        <input value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ padding: 8 }} />
      </label>

      <label>
        Full name
        <input value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: 8 }} />
      </label>

      <label>
        Email (receipt)
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" style={{ padding: 8 }} />
      </label>

      <label>
        Address line 1
        <input value={line1} onChange={(e) => setLine1(e.target.value)} style={{ padding: 8 }} />
      </label>

      <div style={{ display: 'flex', gap: 8 }}>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" style={{ flex: 1, padding: 8 }} />
        <input value={state} onChange={(e) => setState(e.target.value)} placeholder="State" style={{ flex: 1, padding: 8 }} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal Code" style={{ flex: 1, padding: 8 }} />
        <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" style={{ flex: 1, padding: 8 }} />
      </div>

      <label>
        Card details
        <div style={{ padding: 12, border: '1px solid #e2e8f0', borderRadius: 6 }}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </label>

      <button type="submit" disabled={!stripe || loading} style={{ padding: 10, fontSize: 16 }}>
        {loading ? 'Processing…' : `Pay`}
      </button>

      {errorMsg && <div style={{ color: 'red' }}>{errorMsg}</div>}
      {successMsg && <div style={{ color: 'green' }}>{successMsg}</div>}

      <small>
        Test card: <code>4242 4242 4242 4242</code>, any future expiry, CVC <code>123</code> (test mode only).
      </small>
    </form>
  );
}

// import { useEffect, useState } from 'react';

// import { Elements } from '@stripe/react-stripe-js';
// import CheckoutForm from './CheckoutForm'

// function Payment(props) {
//     const { stripePromise } = props;
//     const [clientSecret, setClientSecret] = useState('');

//     useEffect(() => {
//         fetch("https://clear-logical-kangaroo.ngrok-free.app/api/payments/create-payment/")
//             .then((res) => res.json())
//             .then(({ clientSecret }) => setClientSecret(clientSecret));
//     }, []);

//     console.log('clientSecret', clientSecret);
//     console.log('stripePromise', stripePromise);

//     return (
//         <>
//             <h1>Payment</h1>
//             {clientSecret && stripePromise && (
//                 <Elements stripe={stripePromise} options={{ style: CARD_ELEMENT_OPTIONS, hidePostalCode: true }} >
//                     <CheckoutForm />
//                 </Elements>
//             )}
//         </>
//     );
// }

// export default Payment;
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe("pk_test_51SAAOkIXSPJSSn7hXkOPhUAeW3ipVJDULGEOUg0z54DwZhJ5zopxmUXjpPw9zmajQGQ5yk8qH3bZ3HMtqiRxx8YO00SH9bbSdo");

const PaymentPage = () => {
    const [clientSecret, setClientSecret] = useState('');
    const token = localStorage.getItem('access_token');
    useEffect(() => {
        const connected_account_id = localStorage.getItem('connected_account_id'); // seller account

        fetch('http://localhost:8001/api/payment_methods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ connected_account_id, amount: 5000, currency: 'usd' })
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret));
    }, []);

    if (!clientSecret) return <div>Loading payment...</div>;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
        </Elements>
    );
};

export default PaymentPage;

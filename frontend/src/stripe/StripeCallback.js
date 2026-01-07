import React, { useEffect } from 'react';

const StripeCallback = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code'); // OAuth2 code from Stripe
        console.log('OAuth2 code:', code);

        // Send code to backend to exchange for connected account
        fetch('http://localhost:5000/exchange-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU4NTM5MTk0LCJpYXQiOjE3NTg1Mzg4OTQsImp0aSI6IjJhMmVhMDJhZTRkNDRhYmM5YTRmOWJlYTM2NDYyMjE3IiwidXNlcl9pZCI6IjEifQ.DiL1VExhgFfjL3c3X9YMSDVb8fMkMTEjYmWmpLAy6Dg'
            },
            body: JSON.stringify({ code }),
        })
            .then(res => res.json())
            .then(data => {
                console.log('Connected account info:', data);
                localStorage.setItem('connected_account_id', data.connected_account_id);
            });
    }, []);

    return <div>Connecting your Stripe account...</div>;
};

export default StripeCallback;

import React, { useEffect } from 'react';

const StripeCallback = () => {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code'); // OAuth2 code from Stripe
        console.log('OAuth2 code:', code);
        const token = localStorage.getItem('accessToken');

        // Send code to backend to exchange for connected account
        fetch('http://localhost:5000/exchange-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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

import React from 'react';

const CLIENT_ID = 'pmc_1SAB1KIXSPJSSn7htO2sTiam';

const SellerConnectButton = () => {
    const handleConnect = () => {
        const redirectUri = encodeURIComponent('http://localhost:3001/stripe/callback');
        const oauthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&scope=read_write&redirect_uri=${redirectUri}`;
        window.location.href = oauthUrl;
    };

    return <button onClick={handleConnect}>Connect your Stripe Account</button>;
};


export default SellerConnectButton;

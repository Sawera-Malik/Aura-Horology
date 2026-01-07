import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentFormProps {
    clientSecret: string;
    onSuccess: (paymentIntent: any) => void;
    onError: (error: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret, onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        setProcessing(true);
        setError(null);

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (stripeError) {
                setError(stripeError.message || 'Payment failed');
                onError(stripeError);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                onSuccess(paymentIntent);
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            onError(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-md shadow-sm bg-white mt-4">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
                <div className="p-3 border rounded-md">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
            </div>
            {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
                {processing ? 'Processing Payment...' : 'Pay Now'}
            </button>
        </form>
    );
};

export default PaymentForm;

import React, { useEffect, useState } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useCreateIntentMutation, useVerifyPaymentMutation } from '../../redux/endPoints/payment';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PaymentStatusPopup from '../PaymentStatusPopup';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CartSummaryProps {
    items: CartItem[];
    total: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ items, total }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const nativate = useNavigate();
    const { userId } = useAuth()
    const [paymentIntentApi] = useCreateIntentMutation();
    const [paymentVerifyApi] = useVerifyPaymentMutation();
    const search = useSearchParams()[0];
    const [showPopUp, setShowPopUp] = useState(false);
    useEffect(() => {
        if (search.get("payment-status") == 'success') setShowPopUp(true)
        else if (search.get("payment-status") == 'failed') setShowPopUp(true)
        else setShowPopUp(false)
        if (!!search.get("payment-status")) setTimeout(() => search.delete("payment-status"), 1000)
    }, [search])

    const handlePaymentIntent = async () => {
        setError('');
        setLoading(true);

        try {
            // Step 1: Create payment intent
            const res = await paymentIntentApi({ userId, amount: Number(total) } as any)
            const paymentData: any = res?.data;
            if (!paymentData.success) {
                setError(paymentData.message || 'Failed to create payment');
                setLoading(false);
                return;
            }

            // Step 2: Initialize Razorpay
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
                const options = {
                    key: paymentData.data.key,
                    amount: paymentData.data.amount,
                    currency: paymentData.data.currency,
                    order_id: paymentData.data.orderId,
                    handler: (response: any) => handlePaymentSuccess(response, paymentData.data.paymentId),
                    prefill: {
                        name: 'Customer',
                        email: 'customer@example.com',
                        contact: '9876543210',
                    },
                    theme: {
                        color: '#EA580C',
                    },
                    modal: {
                        ondismiss: () => {
                            setLoading(false);
                        },
                    },
                };

                const razorpay = new (window as any).Razorpay(options);
                razorpay.open();

                razorpay.on('payment.failed', (response: any) => {
                    setError(`Payment failed: ${response.error.description}`);
                    setLoading(false);
                });
            };

            script.onerror = () => {
                setError('Failed to load Razorpay. Please try again.');
                setLoading(false);
            };

            document.body.appendChild(script);
        } catch (err: any) {
            setError(err.message || 'Error initiating payment');
            setLoading(false);
        }
    };

    const handlePaymentSuccess = async (response: any, paymentId: string) => {
        try {
            const paylaod = {
                paymentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            }
            const res = await paymentVerifyApi(paylaod)
            const verifyData: any = res.data;
            console.log("res : ", res);
            console.log("verifyData : ", verifyData);

            if (verifyData?.success) {
                nativate(`?payment-status=success`)
            } else {
                nativate(`?payment-status=failed`)
                setError(verifyData?.message || 'Payment verification failed');
            }
        } catch (err: any) {
            setError('Verification error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const taxAmount = (total * 0.05).toFixed(2); // 5% tax example

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
            <PaymentStatusPopup />
            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* Items Breakdown */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                    <span>Items ({items.length})</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Tax & Charges</span>
                    <span>₹{taxAmount}</span>
                </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-orange-600">
                    ₹{(parseFloat(total.toString()) + parseFloat(taxAmount)).toFixed(2)}
                </span>
            </div>

            {/* Payment Button */}
            <button
                onClick={handlePaymentIntent}
                disabled={loading || items.length === 0}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader size={20} className="animate-spin" />
                        Processing...
                    </>
                ) : (
                    'Proceed to Checkout'
                )}
            </button>

            {/* Info Text */}
            <p className="text-xs text-gray-500 text-center mt-4">
                You will be redirected to Razorpay to complete your payment
            </p>
        </div>
    );
};

export default CartSummary;
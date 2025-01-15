import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { X } from 'lucide-react';
import { useCart } from '../components/CartContext';

const Payment = () => {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);
  const amount = router.query.amount || '662.00';

  const handleClose = () => {
    router.push('/checkout');
  };

  const createPaymentLink = async (paymentType) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          payment_type: paymentType,
          order_items: items.map(item => ({
            pizza_id: item.pizzaId,
            quantity: item.quantity,
            size: item.size?.toUpperCase() || 'MEDIUM',
            custom_toppings: item.toppings || []
          })),
          delivery_address: "Test Address",
          contact_number: "1234567890",
          notes: ""
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create payment link');
      }

      const { url } = await response.json();
      if (url) {
        // If it's a redirect URL from your payment provider
        window.location.href = url;
      } else if (response.ok) {
        // If payment is processed directly
        router.push(`/order-success?order_id=${orderId}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Failed to create payment link');
    } finally {
      setLoading(false);
    }
  };

  const paymentOptions = [
    { 
      name: 'Card Payment', 
      icon: '💳',
      type: 'card'
    },
    { 
      name: 'Pay by UPI', 
      icon: '🔰',
      type: 'upi'
    },
    { 
      name: 'Mobile Wallets', 
      icon: '👛',
      type: 'wallet'
    },
    { 
      name: 'Net Banking', 
      icon: '🏦',
      type: 'netbanking'
    },
    { 
      name: 'Bank Transfer', 
      icon: '💸',
      type: 'bank_transfer'
    }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20">
      <div className="flex w-[800px] bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Left Side - Purple Section */}
        <div className="w-1/2 bg-[#7E3AF2] p-8 relative">
          <div className="bg-white/10 rounded-lg p-4 mb-6">
            <img 
              src="/api/placeholder/32/32"
              alt="Merchant Logo" 
              className="w-8 h-8 mb-2"
            />
            <h1 className="text-white text-2xl font-medium mb-2">Pizza Bliss</h1>
            <p className="text-white text-3xl font-medium">₹ {amount}</p>
          </div>
          
          <div className="space-y-4">
            <button 
              className="w-full bg-white/10 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              <div className="flex justify-between items-center">
                <span>Special Offers</span>
                <span>→</span>
              </div>
            </button>
            <button 
              className="w-full bg-white/10 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              <div className="flex justify-between items-center">
                <span>Loyalty Points</span>
                <span>→</span>
              </div>
            </button>
          </div>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="absolute bottom-8 left-8 bg-white/5 rounded-lg p-4">
            <img 
              src="/api/placeholder/120/30"
              alt="Secured by Stripe Payments" 
              className="opacity-60"
            />
          </div>
        </div>

        {/* Right Side - Payment Options */}
        <div className="w-1/2 p-8 bg-gray-50">
          {/* Pongal Banner */}
          <div className="bg-[#FEF7E6] p-4 rounded-lg flex items-center justify-between mb-6 border border-[#977B42]/20">
            <img src="/kite.png" alt="Kite" className="h-6" />
            <span className="text-[#977B42] font-medium">Happy Pongal!</span>
            <img src="/palmtree.png" alt="Palm Trees" className="h-6" />
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Quick Pay</h2>
            <div className="bg-white p-6 rounded-lg text-center shadow-sm border border-gray-100">
              <button 
                onClick={() => createPaymentLink('upi')}
                disabled={loading}
                className="text-[#7E3AF2] font-medium bg-purple-50 px-6 py-3 rounded-lg hover:bg-purple-100 transition-colors w-full"
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
              <p className="text-sm text-gray-600 mt-4">
                Supports all payment methods
                <div className="flex justify-center gap-4 mt-4">
                  <img src="/gpay.png" alt="GPay" className="h-8 p-1 bg-gray-50 rounded-lg" />
                  <img src="/paytm.png" alt="PhonePe" className="h-8 p-1 bg-gray-50 rounded-lg" />
                  <img src="/phonepe.png" alt="Paytm" className="h-8 p-1 bg-gray-50 rounded-lg" />
                </div>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-4">All Payment Options</h2>
            <div className="space-y-3 text-gray-600">
              {paymentOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => createPaymentLink(option.type)}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-50 p-2 rounded-lg">{option.icon}</span>
                    <span>{option.name}</span>
                  </div>
                  <span className="text-gray-400 bg-gray-50 p-2 rounded-full">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
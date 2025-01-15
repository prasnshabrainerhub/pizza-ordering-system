import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { X } from 'lucide-react';
import { useCart } from '../components/CartContext';
import { loadStripe } from '@stripe/stripe-js';



const stripePromise = loadStripe('pk_test_51QgmzvG0J9L6vuulF43QyGxdh0EqxvPgHN8fDJKMxlxWldsnuNNM0WfkYV6OdwfOLTuXGJRvTUeJ6K6JI9beL8rp0089HJu35e');


const Payment = () => {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [showQR, setShowQR] = useState(false);
  const amount = router.query.amount || '662.00';

  const handleClose = () => {
    router.push('/checkout');
  };

const handlePaymentSuccess = async () => {
  try {
    const stripe = await stripePromise;
    
    // Create payment intent with proper request body
    const intentResponse = await fetch(`http://localhost:8000/api/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        amount: parseFloat(amount as string) // Ensure amount is parsed as float
      })
    });
    
    if (!intentResponse.ok) {
      const errorData = await intentResponse.json();
      throw new Error(errorData.detail || 'Failed to create payment intent');
    }

    const { clientSecret } = await intentResponse.json();

    // Confirm payment
    const { error } = await stripe.confirmPayment({
      clientSecret,
      payment_method: {
        type: 'card',
        // Add payment method details based on selection
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Place order after successful payment
    await placeOrder('COMPLETED');
    
    alert('Payment successful!');
    clearCart();
    router.push('/dashboard');

  } catch (error) {
    console.error('Error:', error);
    alert('Payment failed. Please try again.');
  }
};

    const placeOrder = async (paymentStatus: string) => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) throw new Error('Please login to place order');

      const orderData = {
        order_items: items.map(item => ({
          pizza_id: item.pizzaId,
          quantity: item.quantity,
          size: item.size?.toUpperCase() || 'MEDIUM',
          custom_toppings: item.toppings || []
        })),
        payment_method: 'ONLINE',
        payment_status: paymentStatus,
        total_amount: parseFloat(amount),
        delivery_address: "Test Address",
        contact_number: "1234567890",
        notes: ""
      };

      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to place order');
    };

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
              alt="Secured by Cashfree Payments" 
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
            <h2 className="text-sm font-medium text-gray-700 mb-4">Quick UPI</h2>
            <div className="bg-white p-6 rounded-lg text-center shadow-sm border border-gray-100">
              {showQR ? (
                <img 
                  src="/api/placeholder/200/200"
                  alt="QR Code"
                  className="mx-auto mb-4 border-2 border-dashed border-gray-200 p-2 rounded-lg"
                />
              ) : (
                <button 
                  onClick={() => setShowQR(true)}
                  className="text-[#7E3AF2] font-medium bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  Tap to generate QR
                </button>
              )}
              <p className="text-sm text-gray-600 mt-4">
                Scan and pay with
                <div className="flex justify-center gap-4 mt-4">
                  <img src="/gpay.png" alt="GPay" className="h-8 p-1 bg-gray-50 rounded-lg" />
                  <img src="/paytm.png" alt="PhonePe" className="h-8 p-1 bg-gray-50 rounded-lg" />
                  <img src="/phonepe.png" alt="Paytm" className="h-8 p-1 bg-gray-50 rounded-lg" />
                </div>
                or other UPI apps
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-4">Payment Options</h2>
            <div className="space-y-3 text-gray-600">
              {[
                { name: 'Pay by UPI ID', icon: '🔰' },
                { name: 'Card', icon: '💳' },
                { name: 'Wallets', icon: '👛' },
                { name: 'Net Banking', icon: '🏦' },
                { name: 'RTGS / NEFT / IMPS', icon: '💸' }
              ].map((option) => (
                <button
                  key={option.name}
                  onClick={handlePaymentSuccess}
                  className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
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
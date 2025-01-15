import { useRouter } from 'next/router';
import { Header } from '@/components/Header';
import { ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../components/CartContext';
import { useState } from 'react';

const Checkout = () => {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const calculateSubTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateGST = () => {
    return calculateSubTotal() * 0.05;
  };

  const calculateRoundOff = () => {
    const total = calculateSubTotal() + calculateGST();
    return Math.round(total) - total;
  };

  const calculateTotal = () => {
    return Math.round(calculateSubTotal() + calculateGST() + calculateRoundOff());
  };

  const handlePlaceOrder = async (paymentMethod: 'CASH' | 'ONLINE') => {
    try {
      setIsLoading(true);
  
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        alert('Please login to place an order');
        return;
      }
  
      if (paymentMethod === 'ONLINE') {
        router.push(`/payment?amount=${calculateTotal()}`);
        return;
      }
  
      const orderData = {
        order_items: items.map(item => ({
          pizza_id: item.pizzaId,
          quantity: item.quantity,
          size: item.size?.toUpperCase() || 'MEDIUM',
          custom_toppings: item.toppings || []
        })),
        payment_method: 'CASH',
        payment_status: 'PENDING',
        total_amount: calculateTotal(),
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
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to place order');
      }
  
      const orderDetails = await response.json(); // Full order details from the backend
      alert('Order placed successfully!');
  
      clearCart();
  
      // Redirect to order-success with all details
      router.push({
        pathname: '/order-success',
        query: { ...orderDetails }, // Pass full order details in query params
      });
  
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  

  // Check if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-5xl text-black mx-auto px-4 py-8">
          <div className="text-center text-gray-500">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-green-600 font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          {/* Secure Payment Header */}
          <div className="flex items-center gap-2 mb-12">
            <Check className="text-green-600 w-7 h-7" />
            <h1 className="text-3xl font-normal text-black">Secure Payment Options</h1>
          </div>

          {/* Payment Card */}
          <div className="w-full bg-white rounded-3xl shadow-md p-6 mb-12">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="flex items-center text-black"
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-normal text-black">To Pay</span>
                <span className="text-2xl font-normal text-red-500">₹{calculateTotal()}</span>
              </div>
              <div className="w-8" />
            </div>
          </div>

          {/* Payment Options */}
          <div className="grid grid-cols-2 gap-8 w-full">
            {/* Cash on Delivery Option */}
            <button
              onClick={() => handlePlaceOrder('CASH')}
              disabled={isLoading}
              className="bg-white rounded-3xl shadow-md p-12 flex flex-col items-center cursor-pointer transition-all duration-300 hover:bg-purple-200 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-32 h-32 mb-6">
                <img 
                  src="/cash.png"
                  alt="Cash on Delivery"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl text-black">
                {isLoading ? 'Processing...' : 'Cash On Delivery'}
              </span>
            </button>

            {/* Online Payment Option */}
            <button
              onClick={() => handlePlaceOrder('ONLINE')}
              disabled={isLoading}
              className="bg-white rounded-3xl shadow-md p-12 flex flex-col items-center cursor-pointer transition-all duration-300 hover:bg-purple-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-32 h-32 mb-6">
                <img 
                  src="/onlinepayemnt.png"
                  alt="Online Payment"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl text-black">
                {isLoading ? 'Processing...' : 'Online'}
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
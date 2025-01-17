import { useRouter } from 'next/router';
import { Header } from '@/components/Header';
import { ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../components/CartContext';
import { useState } from 'react';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';


interface CustomJwtPayload extends JwtPayload {
  delivery_address?: string;
  contact_number?: string;
}

const Checkout = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const getUserDetailsFromToken = () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
  
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      return {
        address: decoded.delivery_address || '',
        phone: decoded.contact_number || '',
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const calculateTotal = () => {
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const gst = subtotal * 0.05;
    const roundOff = Math.round(subtotal + gst) - (subtotal + gst);
    return Math.round(subtotal + gst + roundOff);
  };

  const handlePlaceOrder = async (paymentMethod: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      const userDetails = getUserDetailsFromToken();
  
      if (!token || !userDetails) {
        alert('Please login to continue');
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
        delivery_address: userDetails.address,
        contact_number: userDetails.phone,
        notes: ""
      };
  
      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to place order');
      }
  
      const orderDetails = await response.json();
      clearCart();
      router.push({
        pathname: '/order-success',
        query: { ...orderDetails },
      });
  
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // Rest of your JSX remains the same...
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          {/* Secure Payment Header */}
          <div className="flex items-center gap-2 mb-12">
            <Check className="text-green-600 w-7 h-7" />
            <h1 className="text-3xl font-normal text-black">{t('Secure Payment Options')}</h1>
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
                <span className="text-2xl font-normal text-black">{t('To Pay')}</span>
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
                <Image 
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
                <Image 
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
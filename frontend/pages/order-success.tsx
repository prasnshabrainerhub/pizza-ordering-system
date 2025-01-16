// pages/order-success.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';


const OrderSuccessPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { order_id, total_amount, delivery_address, contact_number } = router.query;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!router.isReady) return;

      const { order_id } = router.query;
      console.log("1. Order ID from query:", order_id);

      if (!order_id) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        const accessToken = localStorage.getItem('access_token');
        const response = await fetch(`http://localhost:8000/api/orders/${order_id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch order details`);
        }

        const data = await response.json();
        console.log("3. API Response data:", data);
        setOrderDetails(data);
      } catch (error) {
        console.error("4. Error:", error);
        setError(error.message || "Failed to fetch order details");
      } finally {
        setLoading(false);  // Make sure loading is set to false
      }
    };

    fetchOrderDetails();
  }, [router.isReady, router.query]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Order</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Return to Home
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h1>
            <p className="text-gray-600">Thank you for ordering with Pizza Bliss</p>
          </div>

          {/* Order Details */}
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Details</h3>
              {orderDetails && (
                <>
                  <p className="text-gray-600 mb-2"><strong>Order ID:</strong> {orderDetails.order_id}</p>
                  <p className="text-gray-600 mb-2">
                    <strong>Order Date:</strong> {
                      new Date(orderDetails.order_date).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',  // Since you're using ₹ symbol, assuming Indian timezone
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })
                    }
                  </p>
                  <p className="text-gray-600 mb-2"><strong>Status:</strong> {orderDetails.status}</p>
                </>
              )}
            </div>

            {orderDetails && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Summary</h3>
              <div className="bg-gray-50 rounded p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Items Total</span>
                  <span className="text-gray-900">₹{Number(total_amount) - 40}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-900">₹40</span>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{total_amount}</span>
                  </div>
                </div>
              </div>
            </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Information</h3>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-600 mb-2"><strong>Delivery Address:</strong> {delivery_address}</p>
                <p className="text-gray-600 mb-2"><strong>Contact Number:</strong> {contact_number}</p>
                <p className="text-gray-600">Estimated delivery time: 30-45 minutes</p>
                <p className="text-gray-600">You will receive updates about your order via email</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Back to Home
              </button>
              <button 
                onClick={() => router.push('/orders')}
                className="w-full sm:w-auto bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                View All Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ locale }) => {
  if (!locale) {
    locale = ['en', 'es', 'hi'];
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default OrderSuccessPage;
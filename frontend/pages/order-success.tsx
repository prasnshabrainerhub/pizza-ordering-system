import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Header } from '@/components/Header';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Status step component to show progress
const StatusStep = ({ status, currentStatus }) => {
  const statusLabels = {
    'RECEIVED': 'Order Received',
    'PREPARING': 'Preparing',
    'BAKING': 'Baking',
    'READY': 'Ready for Delivery',
    'DELIVERED': 'Delivered'
};

  const getStatusOrder = (status) => {
    const order = ['RECEIVED', 'PREPARING', 'BAKING', 'READY', 'DELIVERED'];
    return order.indexOf(status);
  };

  const isCompleted = getStatusOrder(currentStatus) >= getStatusOrder(status);

  return (
    <div className={`flex items-center gap-2 p-3 ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
      {isCompleted ? (
        <CheckCircle className="w-6 h-6 flex-shrink-0" />
      ) : (
        <Clock className="w-6 h-6 flex-shrink-0" />
      )}
      <span className={`font-medium ${isCompleted ? 'text-green-500' : 'text-gray-500'}`}>
        {statusLabels[status]}
      </span>
    </div>
  );
};

const OrderSuccessPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('RECEIVED'); // Changed to match backend enum
  const [lastUpdated, setLastUpdated] = useState(null);

  const { order_id, total_amount, delivery_address, contact_number } = router.query;

  // Status polling function
  const fetchOrderStatus = useCallback(async (orderId) => {
    if (!orderId) return false;
  
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch order details`);
      }
  
      const data = await response.json();
      
      // Compare status directly instead of updated_at
      if (data.status !== currentStatus) {
        console.log(`Status changed from ${currentStatus} to ${data.status}`);
        setOrderDetails(data);
        setCurrentStatus(data.status);
        setLastUpdated(data.updated_at);
        
        return data.status === 'DELIVERED';
      }
      
      return false;
    } catch (error) {
      console.error("Status polling error:", error);
      return true;
    }
  }, [currentStatus]);
  
  // Update the polling effect
  useEffect(() => {
    let intervalId;
    let failedAttempts = 0;
    const MAX_FAILED_ATTEMPTS = 3;
  
    const startPolling = async () => {
      if (!router.isReady || !router.query.order_id) return;
  
      // Initial fetch
      try {
        const shouldStop = await fetchOrderStatus(router.query.order_id);
        setLoading(false);
  
        if (!shouldStop) {
          // Start polling every 5 seconds
          intervalId = setInterval(async () => {
            try {
              const shouldStop = await fetchOrderStatus(router.query.order_id);
              if (shouldStop) {
                console.log("Stopping polling - order delivered");
                clearInterval(intervalId);
              }
            } catch (error) {
              failedAttempts++;
              console.error(`Polling attempt failed (${failedAttempts}/${MAX_FAILED_ATTEMPTS}):`, error);
              
              if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                console.error("Max failed attempts reached, stopping polling");
                clearInterval(intervalId);
                setError("Failed to get order updates. Please refresh the page.");
              }
            }
          }, 5000);
        }
      } catch (error) {
        console.error("Error in initial fetch:", error);
        setError(error.message || "Failed to fetch order details");
        setLoading(false);
      }
    };
  
    startPolling();
  
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [router.isReady, router.query.order_id, fetchOrderStatus]);
  
  // Effect to show status transitions
  useEffect(() => {
    if (currentStatus === 'DELIVERED') {
      console.log('Order delivered!');
    }
  }, [currentStatus]);

  // Debug logging for status updates
  useEffect(() => {
    console.log("Current status updated to:", currentStatus);
  }, [currentStatus]);

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

          {/* Order Status Progress */}
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {['RECEIVED', 'PREPARING', 'BAKING', 'READY', 'DELIVERED'].map((status) => (
                <StatusStep 
                  key={status} 
                  status={status}
                  currentStatus={currentStatus}
                />
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Details</h3>
            {orderDetails && (
              <>
                <p className="text-gray-600 mb-2"><strong>Order ID:</strong> {orderDetails.order_id}</p>
                <p className="text-gray-600 mb-2">
                  <strong>Order Date:</strong> {
                    new Date(orderDetails.created_at).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })
                  }
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Current Status:</strong> {currentStatus}
                </p>
              </>
            )}
          </div>

          {/* Order Summary */}
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
          
          {/* Delivery Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Information</h3>
            <div className="bg-gray-50 rounded p-4">
              <p className="text-gray-600 mb-2"><strong>Delivery Address:</strong> {delivery_address}</p>
              <p className="text-gray-600 mb-2"><strong>Contact Number:</strong> {contact_number}</p>
              <p className="text-gray-600">Estimated delivery time: 30-45 minutes</p>
              <p className="text-gray-600">You will receive updates about your order via email</p>
            </div>
          </div>

          {/* Action Buttons */}
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
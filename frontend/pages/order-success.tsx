import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Header } from '@/components/Header';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

type OrderStatus = 'RECEIVED' | 'PREPARING' | 'BAKING' | 'READY' | 'DELIVERED';

interface StatusStepProps {
  status: OrderStatus;
  currentStatus: OrderStatus;
}

interface OrderDetails {
  order_id: string;
  created_at: string;
  status: OrderStatus;
}

// Status step component to show progress
const StatusStep = ({ status, currentStatus }: StatusStepProps) => {
  const statusLabels: Record<OrderStatus, string> = {
    RECEIVED: 'Order Received',
    PREPARING: 'Preparing',
    BAKING: 'Baking',
    READY: 'Ready for Delivery',
    DELIVERED: 'Delivered',
  };

  const getStatusOrder = (status: OrderStatus) => {
    const order: OrderStatus[] = ['RECEIVED', 'PREPARING', 'BAKING', 'READY', 'DELIVERED'];
    return order.indexOf(status);
  };

  const isCompleted = getStatusOrder(currentStatus) >= getStatusOrder(status);

  return (
    <div className={`flex items-center gap-2 p-3 ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
      {isCompleted ? (
        <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
      ) : (
        <ClockIcon className="w-6 h-6 flex-shrink-0" />
      )}
      <span className={`font-medium ${isCompleted ? 'text-green-500' : 'text-gray-500'}`}>
        {statusLabels[status]}
      </span>
    </div>
  );
};

const OrderSuccessPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>('RECEIVED');

  const { total_amount, delivery_address, contact_number } = router.query;

  // Status polling function
  const fetchOrderStatus = useCallback(async (orderId: string) => {
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
  
      if (data.status !== currentStatus) {
        console.log(`Status changed from ${currentStatus} to ${data.status}`);
        setOrderDetails(data);
        setCurrentStatus(data.status as OrderStatus);
  
        return data.status === 'DELIVERED';
      }
  
      return false;
    } catch (error) {
      console.error("Status polling error:", error);
      if (error instanceof Error) {
        setError(error);
      }
      return true;
    }
  }, [currentStatus]);

  // Update the polling effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    let failedAttempts = 0;
    const MAX_FAILED_ATTEMPTS = 3;

    const startPolling = async () => {
      if (!router.isReady || !router.query.order_id) return;

      try {
        const shouldStop = await fetchOrderStatus(router.query.order_id as string);
        setLoading(false);

        if (!shouldStop) {
          intervalId = setInterval(async () => {
            try {
              const shouldStop = await fetchOrderStatus(router.query.order_id as string);
              if (shouldStop) {
                console.log("Stopping polling - order delivered");
                if (intervalId) clearInterval(intervalId);
              }
            } catch (error) {
              failedAttempts++;
              console.error(`Polling attempt failed (${failedAttempts}/${MAX_FAILED_ATTEMPTS}):`, error);

              if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                console.error("Max failed attempts reached, stopping polling");
                if (intervalId) clearInterval(intervalId);
                setError(new Error("Failed to get order updates. Please refresh the page."));
              }
            }
          }, 15000);
        }
      } catch (error) {
        console.error("Error in initial fetch:", error);
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
            <ExclamationCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-500 mb-4">{t('Error Loading Order')}</h1>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                {t('Return to Home')}
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                {t('Try Again')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statuses: OrderStatus[] = ['RECEIVED', 'PREPARING', 'BAKING', 'READY', 'DELIVERED'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('Order Successful!')}</h1>
            <p className="text-gray-600">{t('Thank you for ordering with Pizza Bliss')}</p>
          </div>

          {/* Order Status Progress */}
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('Order Status')}</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {statuses.map((status) => (
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('Order Details')}</h3>
            {orderDetails && (
              <>
                <p className="text-gray-600 mb-2"><strong>{t('Order ID')}:</strong> {orderDetails.order_id}</p>
                <p className="text-gray-600 mb-2">
                  <strong>{t('Order Date')}:</strong> {
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
                  <strong>{t('Current Status')}:</strong> {currentStatus} 
                </p>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('Order Summary')}</h3>
            <div className="bg-gray-50 rounded p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">{t('Items Total')}</span>
                <span className="text-gray-900">₹{Number(total_amount) - 40}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">{('Delivery Fee')}</span>
                <span className="text-gray-900">₹40</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-900">{t('Total')}</span>
                  <span className="text-gray-900">₹{total_amount}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Delivery Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('Delivery Information')}</h3>
            <div className="bg-gray-50 rounded p-4">
              <p className="text-gray-600 mb-2"><strong>{t('Delivery Address')}:</strong> {delivery_address}</p>
              <p className="text-gray-600 mb-2"><strong>{t('Contact Number')}:</strong> {contact_number}</p>
              <p className="text-gray-600">{t('Estimated delivery time: 30-45 minutes')}</p>
              <p className="text-gray-600">{t('You will receive updates about your order via email')}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              {('Back to Home')}
            </button>
            <button 
              onClick={() => router.push('/orders')}
              className="w-full sm:w-auto bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              {t('View All Orders')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default OrderSuccessPage;
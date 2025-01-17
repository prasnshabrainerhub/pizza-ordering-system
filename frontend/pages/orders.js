import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Eye } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const OrderCard = ({ order, onViewOrder }) => {
  return (
    <Card className="mb-4 bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600">🍔</span>
            </div>
            <div>
              <p className="text-black">#{order.order_id}</p>
            </div>
          </div>
          <div className='w-70bg-blue-500 text-black text-center rounded px-2 py-1 text-sm inline-block mb-2" h-50 bg-blue-100 rounded-lg flex items-center justify-center'>
          <span className="text-black">{order.status}</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-black">{new Date(order.order_date).toLocaleString()}</p>
          <div className="flex items-center space-x-4">
            <p className="text-black">{order.delivery_type || 'delivery'}</p>
            <p className="font-medium text-black">₹{order.total_amount}</p>
            <button 
              onClick={() => onViewOrder(order)}
              className="text-green-600 hover:text-green-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OrderDetails = ({ order, onBack }) => (
  <Card className="bg-white">
    <CardContent className="p-4">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-4 text-black">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-semibold text-black">Order #{order.order_id}</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-black">Status</span>
          <span className="text-black">{order.status}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-black">Order Date</span>
          <span className="text-black">{new Date(order.order_date).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-black">Restaurant</span>
          <span className="text-black">Ahmedabad</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-black">Order Type</span>
          <span className="text-black">{order.delivery_type || 'delivery'}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-black">Total Amount</span>
          <span className="text-black">₹{order.total_amount}</span>
        </div>
        
        {order.items && (
          <div className="mt-6">
            <h4 className="font-medium mb-2 text-black">Order Items</h4>
            <div className="border rounded-lg overflow-hidden">
              {order.items.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between p-3 border-b last:border-b-0 text-black"
                >
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const OrdersPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login?redirect=/orders');
      return false;
    }
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('access_token');
        router.push('/login?redirect=/orders');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('access_token');
      router.push('/login?redirect=/orders');
      return false;
    }
  }, [router]);

  const fetchOrders = useCallback(async () => {
    if (!checkAuth()) return;
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('access_token');
        router.push('/login?redirect=/orders');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [checkAuth, router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {t('Retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => selectedOrder ? setSelectedOrder(null) : router.back()} 
          className="mr-4 text-black"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-black">{t('Orders')}</h1>
      </div>
      
      {selectedOrder ? (
        <OrderDetails 
          order={selectedOrder} 
          onBack={() => setSelectedOrder(null)} 
        />
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-black">{t('No orders found')}</p>
            </div>
          ) : (
            orders.map(order => (
              <OrderCard
                key={order.order_id}
                order={order}
                onViewOrder={setSelectedOrder}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async ({ locale }) => {
  if (!locale) {
    locale = 'en';
  }
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default OrdersPage;
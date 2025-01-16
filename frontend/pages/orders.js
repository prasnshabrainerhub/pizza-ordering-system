import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Eye } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const OrderStatus = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'received':
        return 'bg-blue-100 text-blue-800';
      case 'being baked':
        return 'bg-yellow-100 text-yellow-800';
      case 'dispatched':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

const OrderStatusProgress = ({ status }) => {
  const statuses = ['received', 'being baked', 'dispatched', 'delivered'];
  const currentIndex = statuses.indexOf(status?.toLowerCase());
  
  console.log('Progress bar status:', status);
  console.log('Current index:', currentIndex);

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between mb-2">
        {statuses.map((s, index) => (
          <div
            key={s}
            className={`text-sm ${
              index <= currentIndex ? 'text-black' : 'text-gray-400'
            } capitalize`}
          >
            {s}
          </div>
        ))}
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          {statuses.map((_, index) => (
            <div
              key={index}
              style={{ width: `${100 / statuses.length}%` }}
              className={`${
                index <= currentIndex 
                  ? index === currentIndex 
                    ? 'bg-green-500' 
                    : 'bg-green-600'
                  : 'bg-gray-200'
              } transition-all duration-500`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
          <OrderStatus status={order.status} />
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
        <OrderStatusProgress status={order.status} />
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
        <div className="flex justify-between items-center">
          <span className="text-black">Status</span>
          <OrderStatus status={order.status} />
        </div>
        
        <div className="flex justify-between">
          <span className="text-black">Order Date</span>
          <span className="text-black">{new Date(order.order_date).toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-black">Restaurant</span>
          <span className="text-black">Surdhara</span>
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
        
        <OrderStatusProgress status={order.status} />
      </div>
    </CardContent>
  </Card>
);

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const statusIntervalsRef = useRef({});

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

  const updateOrderStatus = useCallback((orderId) => {
    const statuses = ['received', 'being baked', 'dispatched', 'delivered'];
    
    setOrders(prevOrders => {
      const orderIndex = prevOrders.findIndex(order => order.order_id === orderId);
      if (orderIndex === -1) return prevOrders;

      const order = prevOrders[orderIndex];
      const currentStatusIndex = statuses.indexOf(order.status.toLowerCase());
      
      // If already delivered or invalid status, don't update
      if (currentStatusIndex === -1 || currentStatusIndex === statuses.length - 1) {
        console.log(`Order ${orderId} is already delivered or has invalid status`);
        return prevOrders;
      }

      const nextStatus = statuses[currentStatusIndex + 1];
      console.log(`Updating order ${orderId} from ${order.status} to ${nextStatus}`);

      const updatedOrders = [...prevOrders];
      updatedOrders[orderIndex] = {
        ...order,
        status: nextStatus,
        lastUpdated: new Date().toISOString()
      };

      // If status becomes 'delivered', clear the interval
      if (nextStatus === 'delivered') {
        console.log(`Order ${orderId} is now delivered. Clearing interval.`);
        if (statusIntervalsRef.current[orderId]) {
          clearInterval(statusIntervalsRef.current[orderId]);
          delete statusIntervalsRef.current[orderId];
        }
      }

      return updatedOrders;
    });
  }, []);

  // Setup intervals for status updates
  useEffect(() => {
    console.log('Setting up status intervals for orders:', orders);
    
    // Clear any existing intervals
    Object.values(statusIntervalsRef.current).forEach(interval => clearInterval(interval));
    statusIntervalsRef.current = {};

    // Set up new intervals for non-delivered orders
    orders.forEach(order => {
      if (order.status.toLowerCase() !== 'delivered') {
        console.log(`Setting up interval for order ${order.order_id}`);
        
        statusIntervalsRef.current[order.order_id] = setInterval(() => {
          console.log(`Checking status update for order ${order.order_id}`);
          updateOrderStatus(order.order_id);
        }, 10000); // 30 seconds
      } else {
        console.log(`Order ${order.order_id} is already delivered. No interval needed.`);
      }
    });

    return () => {
      console.log('Cleaning up all intervals');
      Object.values(statusIntervalsRef.current).forEach(interval => clearInterval(interval));
      statusIntervalsRef.current = {};
    };
  }, [orders, updateOrderStatus]);

  useEffect(() => {
    fetchOrders();
    const fetchInterval = setInterval(fetchOrders, 300000); // 5 minutes
    return () => clearInterval(fetchInterval);
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
          Retry
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
        <h1 className="text-xl font-semibold text-black">Back</h1>
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
              <p className="text-black">No orders found</p>
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
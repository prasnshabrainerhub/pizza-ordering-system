import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Eye } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/router';

// Utility function for WebSocket management
const useOrderSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.error('No access token found');
          return;
        }

        console.log('Attempting WebSocket connection...');
        const ws = new WebSocket(`ws://localhost:8000/ws/orders?token=${encodeURIComponent(token)}`);

        ws.onopen = () => {
          console.log('WebSocket connection established');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received WebSocket message:', data);
            // Handle your message here
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket Error:', {
            error,
            readyState: ws.readyState,
            url: ws.url
          });
        };

        ws.onclose = (event) => {
          console.log('WebSocket connection closed:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
          
          // Attempt to reconnect unless it was a clean closure
          if (event.code !== 1000) {
            console.log('Attempting to reconnect...');
            setTimeout(connectWebSocket, 5000);
          }
        };

        setSocket(ws);
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (socket?.readyState === WebSocket.OPEN) {
        socket.close(1000, 'Component unmounting');
      }
    };
  }, []);

  return socket;
};

const OrderStatus = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-purple-100 text-purple-800';
      case 'food ready':
        return 'bg-yellow-100 text-yellow-800';
      case 'dispatched':
        return 'bg-orange-100 text-orange-800';
      case 'done':
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

const OrderCard = ({ order, onViewDetails }) => (
  <Card className="mb-4">
    <CardContent className="p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Order #{order.order_id}</p>
          <p className="text-lg font-medium mt-1">{new Date(order.order_date).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-4">
          <OrderStatus status={order.status} />
          <p className="text-lg font-medium">₹{order.total_amount}</p>
          <button
            onClick={() => onViewDetails(order)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const OrderDetails = ({ order, onBack }) => (
  <Card className="mb-4">
    <CardHeader className="flex flex-row items-center">
      <button onClick={onBack} className="mr-4">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <CardTitle>Order Details #{order.order_id}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status</span>
          <OrderStatus status={order.status} />
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Order Date</span>
          <span>{new Date(order.order_date).toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Total Amount</span>
          <span>₹{order.total_amount}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Address</span>
          <span>{order.delivery_address}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Contact Number</span>
          <span>{order.contact_number}</span>
        </div>

        <div className="mt-6">
          <h4 className="font-medium mb-2">Order Items</h4>
          {order.items?.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b">
              <span>{item.name}</span>
              <span>x{item.quantity}</span>
            </div>
          ))}
        </div>
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
  const socket = useOrderSocket();

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
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const updatedOrder = JSON.parse(event.data);
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.order_id === updatedOrder.order_id 
              ? { ...order, ...updatedOrder }
              : order
          )
        );
      };
    }
  }, [socket]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={fetchOrders}
          className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl text-gray-800 mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
      
      {selectedOrder ? (
        <OrderDetails 
          order={selectedOrder} 
          onBack={() => setSelectedOrder(null)} 
        />
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            orders.map(order => (
              <OrderCard
                key={order.order_id}
                order={order}
                onViewDetails={setSelectedOrder}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
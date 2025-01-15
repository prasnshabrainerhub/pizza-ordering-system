import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Promotions } from '../components/Pramotions';
import { PizzaCard } from '../components/ui/PizzaCard';
import { Pizza } from '../types/types';
import { StoreHeader } from '../components/StoreHeader';
import { AdminPanel } from '../components/AdminPanel';
import { PizzaManagement } from '../components/admin/CreatePizzaForm';
import { OrderHistory } from '../components/admin/OrderHistory';
import { CouponManagement } from '../components/admin/CreateCouponForm';
import { ToppingManagement } from '../components/admin/CreateToppings';
import { PIZZA_CATEGORIES } from '../types/types';

const Dashboard: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminView, setAdminView] = useState<string>('');
  
  const staticPizzas: Pizza[] = [
    // Category 1: Pizza Category 1
    {
      id: '1',
      name: 'Classic Margherita',
      description: 'Fresh tomatoes, mozzarella, and basil.',
      base_price: 8,
      category: PIZZA_CATEGORIES[0].id,
      sizes: [
        { size: 'small', price: 8 },
        { size: 'medium', price: 10 },
        { size: 'large', price: 12 },
      ],
      image_url: '/Home.png',
    },
    {
      id: '2',
      name: 'Pepperoni Feast',
      description: 'Loaded with pepperoni and cheese.',
      base_price: 10,
      category: PIZZA_CATEGORIES[0].id,
      sizes: [
        { size: 'small', price: 10 },
        { size: 'medium', price: 12 },
        { size: 'large', price: 14 },
      ],
      image_url: '/Home1.png',
    },
    {
      id: '3',
      name: 'Veggie Supreme',
      description: 'Topped with fresh vegetables.',
      base_price: 9,
      category: PIZZA_CATEGORIES[0].id,
      sizes: [
        { size: 'small', price: 9 },
        { size: 'medium', price: 11 },
        { size: 'large', price: 13 },
      ],
      image_url: '/pizza3.png',
    },

    // Category 2: Pizza Category 2
    {
      id: '4',
      name: 'Hawaiian Paradise',
      description: 'Topped with ham, pineapple, and cheese.',
      base_price: 12,
      category: PIZZA_CATEGORIES[1].id,
      sizes: [
        { size: 'small', price: 12 },
        { size: 'medium', price: 14 },
        { size: 'large', price: 16 },
      ],
      image_url: '/Home.png',
    },
    {
      id: '5',
      name: 'Meat Lovers',
      description: 'Loaded with pepperoni, sausage, and bacon.',
      base_price: 14,
      category: PIZZA_CATEGORIES[1].id,
      sizes: [
        { size: 'small', price: 14 },
        { size: 'medium', price: 16 },
        { size: 'large', price: 18 },
      ],
      image_url: '/Home1.png',
    },
    {
      id: '6',
      name: 'Veggie Delight',
      description: 'Topped with fresh vegetables and cheese.',
      base_price: 10,
      category: PIZZA_CATEGORIES[1].id,
      sizes: [
        { size: 'small', price: 10 },
        { size: 'medium', price: 12 },
        { size: 'large', price: 14 },
      ],
      image_url: '/pizza3.png',  
    },

    // Category 3: Pizza Category 3 
    {
      id: '7',
      name: 'Pepperoni Paradise',
      description: 'Loaded with pepperoni and cheese.',
      base_price: 14,
      category: PIZZA_CATEGORIES[2].id,
      sizes: [
        { size: 'small', price: 14 },
        { size: 'medium', price: 16 },
        { size: 'large', price: 18 },
      ],
      image_url: '/Home.png',
    },
    {
      id: '8',
      name: 'Hawaiian Paradise',
      description: 'Topped with ham, pineapple, and cheese.',
      base_price: 12,
      category: PIZZA_CATEGORIES[2].id,
      sizes: [
        { size: 'small', price: 12 },
        { size: 'medium', price: 14 },
        { size: 'large', price: 16 }, 
      ],
      image_url: '/Home1.png',
    },
    {
      id: '9',
      name: 'Veggie Delight',
      description: 'Topped with fresh vegetables and cheese.',
      base_price: 10,
      category: PIZZA_CATEGORIES[2].id,
      sizes: [
        { size: 'small', price: 10 },
        { size: 'medium', price: 12 },
        { size: 'large', price: 14 },
      ],
      image_url: 'pizza3.png',
    },

    // Category 4: Pizza Category 4
    {
      id: '10',
      name: 'Hawaiian Paradise',
      description: 'Topped with ham, pineapple, and cheese.',
      base_price: 12,
      category: PIZZA_CATEGORIES[3].id,
      sizes: [
        { size: 'small', price: 12 },
        { size: 'medium', price: 14 },
        { size: 'large', price: 16 },
      ],
      image_url: '/Home.png',
    },
    {
      id: '11',
      name: 'Meat Lovers',
      description: 'Loaded with pepperoni, sausage, and bacon.',
      base_price: 14,
      category: PIZZA_CATEGORIES[3].id,
      sizes: [
        { size: 'small', price: 14 },
        { size: 'medium', price: 16 },
        { size: 'large', price: 18 },
      ],
      image_url: '/Home1.png',
    },
    {
      id: '12',
      name: 'Veggie Delight',
      description: 'Topped with fresh vegetables and cheese.',
      base_price: 10,
      category: PIZZA_CATEGORIES[3].id,
      sizes: [
        { size: 'small', price: 10 },
        { size: 'medium', price: 12 },
        { size: 'large', price: 14 },
      ],
      image_url: '/pizza3.png',  
    },

    // Category 5: Pizza Category 5
    {
      id: '13',
      name: 'Pepperoni Paradise',
      description: 'Loaded with pepperoni and cheese.',
      base_price: 14,
      category: PIZZA_CATEGORIES[4].id,
      sizes: [
        { size: 'small', price: 14 },
        { size: 'medium', price: 16 },
        { size: 'large', price: 18 },
      ],
      image_url: '/Home.png',
    },    
    {
      id: '14',
      name: 'Hawaiian Paradise',
      description: 'Topped with ham, pineapple, and cheese.',
      base_price: 12,
      category: PIZZA_CATEGORIES[4].id,
      sizes: [
        { size: 'small', price: 12 },
        { size: 'medium', price: 14 },
        { size: 'large', price: 16 }, 
      ],
      image_url: '/Home1.png',
    },
    {
      id: '15',
      name: 'Veggie Delight',
      description: 'Topped with fresh vegetables and cheese.',
      base_price: 10,
      category: PIZZA_CATEGORIES[4].id,
      sizes: [
        { size: 'small', price: 10 },
        { size: 'medium', price: 12 },
        { size: 'large', price: 14 },
      ],
      image_url: '/pizza3.png',
    },
  ];

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(payload.role === 'admin');
      }
    };

    checkAdminStatus();
  }, []);

  useEffect(() => {
    // Fetch pizza data from FastAPI backend
    const fetchPizzas = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/pizzas');
        if (response.ok) {
          const data: Pizza[] = await response.json();
          setPizzas(data);
        } else {
          throw new Error('Failed to fetch pizzas');
        }
      } catch (error) {
        console.error('Error fetching pizzas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, [adminView]); // Refetch when adminView changes

  const renderAdminContent = () => {
    switch (adminView) {
      case 'pizzas':
    return (
        <div>
            <button 
                onClick={() => setAdminView('')}
                className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
                ← Back
            </button>
            <PizzaManagement />
        </div>
    );
      case 'orders':
        return (
          <div>
            <button 
              onClick={() => setAdminView('')}
              className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              ← Back
            </button>
            <OrderHistory />
          </div>
        );
        case 'coupons':
          return (
            <div>
              <button 
                onClick={() => setAdminView('')}
                className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                ← Back
              </button>
              <CouponManagement />
            </div>
          );
        case 'toppings':
          return (
            <div>
              <button 
                onClick={() => setAdminView('')}
                className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                ← Back
              </button>
              <ToppingManagement />
            </div>
          );
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.reload();
  }

  return (
    <div className="min-h-screen flex flex-col text-black bg-gray-50">
    <Header />
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar with Fixed Width */}
      <div className="w-72 bg-gray-200 flex-shrink-0 overflow-y-auto">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <StoreHeader />

        {/* Admin Panel */}
        {isAdmin && (
          <div className="mb-6">
            <AdminPanel onViewChange={setAdminView} />
          </div>
        )}

        {/* Conditional Rendering for Admin Content or Main Dashboard */}
        {adminView ? (
          <div className="p-6 bg-white shadow-md rounded-lg">
            {renderAdminContent()}
          </div>
        ) : (
          <>
            <Promotions />
            {PIZZA_CATEGORIES.map(category => {
              const categoryPizzas = pizzas.filter(pizza => pizza.category === category.id);
              if (categoryPizzas.length === 0) return null;
              
              return (
                <div key={category.id} className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">
                    {category.icon} {category.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryPizzas.map((pizza) => (
                      //@ts-ignore
                      <PizzaCard key={pizza.id} pizza={pizza} />
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </main>
    </div>
  </div>
  );
};

export default Dashboard;
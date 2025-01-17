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
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Dashboard: React.FC = () => {
  const { t } = useTranslation('common');
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminView, setAdminView] = useState<string>('');

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
                {t('← Back')}
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
              {t('← Back')}
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
                {t('← Back')}
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
                {t('← Back')}
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


export const getServerSideProps = async ({ locale }) => {
  if (!locale) {
    locale = ['en', 'es', 'hi'];
  }
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
  };
};

export default Dashboard;
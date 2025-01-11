import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Promotions } from '../components/Pramotions';
import { PizzaCard } from '../components/ui/PizzaCard';
import { Pizza } from '../types/types';
import { StoreHeader } from '../components/StoreHeader';
import { AdminPanel } from '../components/AdminPanel';
import { CreatePizzaForm } from '../components/admin/CreatePizzaForm';
import { ManagePizzas } from '../components/admin/ManagePizzas';
import { OrderHistory } from '../components/admin/OrderHistory';

const Dashboard: React.FC = () => {
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
      case 'create':
        //@ts-ignore
        return <CreatePizzaForm onSuccess={() => setAdminView('')} />;
      case 'manage':
        //@ts-ignore
        return <ManagePizzas onSuccess={() => fetchPizzas()} />;
      case 'orders':
        return <OrderHistory />;
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
    <div className="min-h-screen text-black bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <StoreHeader />
          <div className="p-6">
            {isAdmin && <AdminPanel onViewChange={setAdminView} />}
            
            {adminView ? (
              renderAdminContent()
            ) : (
              <>
                <Promotions />
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Buy 1 Get 4</h2>
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pizzas.map((pizza) => (
                        <PizzaCard key={pizza.id} pizza={pizza} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
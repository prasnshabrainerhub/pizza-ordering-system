import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { PIZZA_CATEGORIES } from '../types/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Pizza {
  id: string;
  name: string;
  category: string;
  base_price: number;
}

export const Sidebar = () => {
  const { t } = useTranslation();
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/pizzas');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched pizzas:', data); // For debugging
        setPizzas(data);
      }
    } catch (error) {
      console.error('Error fetching pizzas:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getPizzasByCategory = (categoryId: string) => {
    return pizzas.filter(pizza => pizza.category.toLowerCase() === categoryId.toLowerCase());
  };

  if (loading) {
    return <div className="p-4">{t('Loading...')}</div>;
  }

  return (
    <div className="w-72 bg-white text-black shadow-lg fixed h-[calc(100vh-64px)] rounded-xl overflow-y-auto">
      <div className="p-3">
        <div className="bg-green-600 rounded-lg shadow-md p-3">
          <h2 className="text-xl font-bold text-white text-center font-sans">
            {t('Categories')}
          </h2>
        </div>
      </div>
      <nav className="p-3">
        {PIZZA_CATEGORIES.map((category) => {
          const categoryPizzas = getPizzasByCategory(category.id);
          
          return (
            <div key={category.id} className="mb-2">
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full text-left p-3 bg-gray-100 hover:bg-green-500 hover:text-white shadow rounded-md flex items-center gap-3 transform hover:-translate-y-1 transition-all duration-200"
              >
                <span className="text-lg">{category.icon}</span>
                <span className="text-sm font-medium flex-1">{t(category.name)}</span>
                {categoryPizzas.length > 0 && (
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                    {categoryPizzas.length}
                  </span>
                )}
                {expandedCategories.includes(category.id) ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>
              
              {/* Submenu for pizzas in this category */}
              {expandedCategories.includes(category.id) && categoryPizzas.length > 0 && (
                <div className="ml-8 mt-2 space-y-2">
                  {categoryPizzas.map(pizza => (
                    <div 
                      key={pizza.id}
                      className="p-2 text-sm hover:bg-gray-100 rounded-md cursor-pointer flex justify-between items-center"
                    >
                      <span>{pizza.name}</span>
                      <span className="text-green-600 font-medium">₹{pizza.base_price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
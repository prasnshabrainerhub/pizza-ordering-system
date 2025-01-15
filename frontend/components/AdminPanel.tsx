import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { Pizza, History, Sandwich, Tag } from 'lucide-react';

interface AdminPanelProps {
  onViewChange: (view: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onViewChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-red-500">Admin Controls</h2>
      <div className="flex gap-4">
        <button
          onClick={() => onViewChange('pizzas')}
          className="flex items-center justify-center gap-2 p-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <Pizza size={24} />
          Manage Pizzas
        </button>
        <button
          onClick={() => onViewChange('orders')}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          <History size={20} />
          Order History
        </button>
        <button
        onClick={() => onViewChange('toppings')}
        className="flex items-center justify-center gap-2 p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
      >
        <Sandwich size={24} />
        Manage Toppings
      </button>
      
      <button
        onClick={() => onViewChange('coupons')}
        className="flex items-center justify-center gap-2 p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
      >
        <Tag size={24} />
        Manage Coupons
      </button>
      </div>
    </div>
  );
};
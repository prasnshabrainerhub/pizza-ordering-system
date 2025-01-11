import React, { useState } from 'react';
import { PlusCircle, List, Package, History } from 'lucide-react';

interface AdminPanelProps {
  onViewChange: (view: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onViewChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-red-500">Admin Controls</h2>
      <div className="flex gap-4">
        <button
          onClick={() => onViewChange('create')}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <PlusCircle size={20} />
          Add New Pizza
        </button>
        <button
          onClick={() => onViewChange('manage')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Package size={20} />
          Manage Pizzas
        </button>
        <button
          onClick={() => onViewChange('orders')}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          <History size={20} />
          Order History
        </button>
      </div>
    </div>
  );
};
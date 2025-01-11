import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export const ManagePizzas: React.FC = () => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);

  useEffect(() => {
    fetchPizzas();
  }, []);

  const fetchPizzas = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/pizzas');
      if (response.ok) {
        const data = await response.json();
        setPizzas(data);
      }
    } catch (error) {
      console.error('Error fetching pizzas:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('access_token');
    if (!confirm('Are you sure you want to delete this pizza?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/pizzas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPizzas(pizzas.filter(pizza => pizza.id !== id));
        alert('Pizza deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting pizza:', error);
      alert('Failed to delete pizza');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Manage Pizzas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pizzas.map((pizza) => (
              <tr key={pizza.id}>
                <td className="px-6 py-4 whitespace-nowrap">{pizza.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{pizza.price}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{pizza.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => handleDelete(pizza.id)}
                    className="text-red-600 hover:text-red-900 mx-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
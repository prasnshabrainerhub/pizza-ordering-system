import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Pizza, Plus, Edit2, Trash2 } from 'lucide-react';
import { UUID } from 'crypto';

interface Topping {
  topping_id: UUID;
  name: string;
  price: number;
  is_vegetarian: boolean;
}

interface ToppingFormData {
  name: string;
  price: number;
  is_vegetarian: boolean;
}

export const ToppingManagement: React.FC = () => {
  const { t } = useTranslation();
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [isAddingTopping, setIsAddingTopping] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [formData, setFormData] = useState<ToppingFormData>({
    name: '',
    price: 0,
    is_vegetarian: false,
  });

  const fetchToppings = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/toppings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setToppings(data);
      }
    } catch (error) {
      console.error('Error fetching toppings:', error);
    }
  };

  useEffect(() => {
    fetchToppings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    try {
      const url = editingTopping
        ? `http://localhost:8000/api/toppings/${editingTopping.topping_id}`
        : 'http://localhost:8000/api/toppings';
      
      const method = editingTopping ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchToppings();
        setFormData({ name: '', price: 0, is_vegetarian: false });
        setIsAddingTopping(false);
        setEditingTopping(null);
      }
    } catch (error) {
      console.error('Error saving topping:', error);
    }
  };

  const handleDelete = async (toppingId: UUID) => {
    if (!confirm('Are you sure you want to delete this topping?')) return;

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`http://localhost:8000/api/toppings/${toppingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchToppings();
      }
    } catch (error) {
      console.error('Error deleting topping:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{t('Manage Toppings')}</h2>
        <button
          onClick={() => setIsAddingTopping(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus size={20} />
          {t('Add Topping')}
        </button>
      </div>

      {(isAddingTopping || editingTopping) && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('Name')}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('Price')}</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_vegetarian}
                  onChange={(e) => setFormData({ ...formData, is_vegetarian: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm font-medium">{t('Vegetarian')}</span>
              </label>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingTopping ? 'Update' : 'Add'} {t('Topping')}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingTopping(false);
                setEditingTopping(null);
                setFormData({ name: '', price: 0, is_vegetarian: false });
              }}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Name')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Price')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Vegetarian')}</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {toppings.map((topping) => (
              <tr key={topping.topping_id}>
                <td className="px-6 py-4 whitespace-nowrap">{topping.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{topping.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {topping.is_vegetarian ? '✅' : '❌'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setEditingTopping(topping);
                      setFormData(topping);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(topping.topping_id)}
                    className="text-red-600 hover:text-red-900"
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
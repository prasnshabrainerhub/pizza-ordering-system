import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { DiscountType } from '../../types/types';

interface Coupon {
  coupon_id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  description: string;
  valid_from: string;
  valid_until: string;
  min_order_value: number;
  max_discount: number;
  usage_limit: number | null;
  times_used?: number;
}

interface CouponFormData {
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  description: string;
  valid_from: string;
  valid_until: string;
  min_order_value: number;
  max_discount: number;
  usage_limit: number | null;
}

export const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    discount_type: DiscountType.PERCENTAGE,
    discount_value: 0,
    description: '',
    valid_from: new Date().toISOString().slice(0, 16),
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    min_order_value: 0,
    max_discount: 0,
    usage_limit: null
  });

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:8000/api/coupons', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    try {
      const url = editingCoupon
        ? `http://localhost:8000/api/coupons/${editingCoupon.coupon_id}`
        : 'http://localhost:8000/api/coupons';
      
      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          valid_from: new Date(formData.valid_from).toISOString(),
          valid_until: new Date(formData.valid_until).toISOString()
        }),
      });

      if (response.ok) {
        await fetchCoupons();
        setFormData({
          code: '',
          discount_type: DiscountType.PERCENTAGE,
          discount_value: 0,
          description: '',
          valid_from: new Date().toISOString().slice(0, 16),
          valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          min_order_value: 0,
          max_discount: 0,
          usage_limit: null
        });
        setIsAddingCoupon(false);
        setEditingCoupon(null);
      }
    } catch (error) {
      console.error('Error saving coupon:', error);
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(`http://localhost:8000/api/coupons/${couponId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchCoupons();
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Coupons</h2>
        <button
          onClick={() => setIsAddingCoupon(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Coupon
        </button>
      </div>

      {(isAddingCoupon || editingCoupon) && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discount Type</label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as DiscountType })}
                className="w-full p-2 border rounded"
              >
                <option value={DiscountType.PERCENTAGE}>Percentage</option>
                <option value={DiscountType.FIXED}>Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Value ({formData.discount_type === DiscountType.PERCENTAGE ? '%' : '₹'})
              </label>
              <input
                type="number"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valid From</label>
              <input
                type="datetime-local"
                value={formData.valid_from}
                onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Valid Until</label>
              <input
                type="datetime-local"
                value={formData.valid_until}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Order Value (₹)</label>
              <input
                type="number"
                value={formData.min_order_value}
                onChange={(e) => setFormData({ ...formData, min_order_value: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Discount (₹)</label>
              <input
                type="number"
                value={formData.max_discount}
                onChange={(e) => setFormData({ ...formData, max_discount: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Usage Limit</label>
              <input
                type="number"
                value={formData.usage_limit || ''}
                onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingCoupon ? 'Update' : 'Add'} Coupon
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingCoupon(false);
                setEditingCoupon(null);
                setFormData({
                  code: '',
                  discount_type: DiscountType.PERCENTAGE,
                  discount_value: 0,
                  description: '',
                  valid_from: new Date().toISOString().slice(0, 16),
                  valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
                  min_order_value: 0,
                  max_discount: 0,
                  usage_limit: null
                });
              }}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Period</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon) => (
              <tr key={coupon.coupon_id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{coupon.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coupon.discount_type === DiscountType.PERCENTAGE 
                    ? `${coupon.discount_value}%` 
                    : `₹${coupon.discount_value}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(coupon.valid_from).toLocaleDateString()} - {new Date(coupon.valid_until).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coupon.times_used || 0} / {coupon.usage_limit || '∞'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setEditingCoupon(coupon);
                      setFormData({
                        ...coupon,
                        valid_from: new Date(coupon.valid_from).toISOString().slice(0, 16),
                        valid_until: new Date(coupon.valid_until).toISOString().slice(0, 16),
                      });
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.coupon_id)}
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
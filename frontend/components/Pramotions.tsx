import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface Coupon {
  coupon_id: string;
  code: string;
  description: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  valid_from: string;
  valid_until: string;
}

export const Promotions: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:8000/api/coupons', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch coupons');
        }
        
        const data = await response.json();
        const activeCoupons = data.filter((coupon: Coupon) => {
          const now = new Date();
          const validFrom = new Date(coupon.valid_from);
          const validUntil = new Date(coupon.valid_until);
          return validFrom <= now && now <= validUntil;
        });
        
        setCoupons(activeCoupons);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load promotions');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      <div className="px-4 py-2">
        <h2 className="text-green-600 font-semibold text-lg inline-block px-6 py-1 bg-white rounded-full shadow-sm">
          PROMOS
        </h2>
      </div>
      
      {coupons.length === 0 ? (
        <p className="px-4 text-gray-500">No active promotions available</p>
      ) : (
        <>
          <div className="flex gap-6 overflow-x-auto px-4 py-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.coupon_id}
                className="flex-shrink-0 bg-white rounded-lg p-6 min-w-[200px] relative group cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => handleCopyCode(coupon.code)}
              >
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-green-600 font-medium">Click to copy</span>
                </div>
                <div className="mt-2">
                  <p className="text-lg font-medium">
                    {coupon.description || (coupon.discount_type === 'PERCENTAGE' 
                      ? `${coupon.discount_value}% off`
                      : `flat ${coupon.discount_value} off`)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Use code: <span className="font-medium text-green-600">{coupon.code}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full h-px bg-green-600 mt-4"></div>
        </>
      )}
    </div>
  );
};

export default Promotions;
import React from 'react';
import { Promotion } from '../types/types';

const promotions: Promotion[] = [
  { id: '1', title: 'buy 2 get 1 free', type: 'BUY_GET', value: '2+1' },
  { id: '2', title: 'flat 100 off', type: 'FLAT', value: '100' },
  { id: '3', title: 'flat 200 off', type: 'FLAT', value: '200' },
  { id: '4', title: 'flat 250 off', type: 'FLAT', value: '250' },
  { id: '5', title: 'flat 350 off', type: 'FLAT', value: '350' },
  { id: '6', title: 'buy 1 get 1 free', type: 'BUY_GET', value: '1+1' },
  { id: '7', title: 'flat 50 off', type: 'FLAT', value: '50' },
  { id: '8', title: 'flat 75 off', type: 'FLAT', value: '75' },
];

export const Promotions: React.FC = () => {
  return (
    <div className="p-4 text-black">
      <h2 className="text-xl font-semibold mb-4">PROMOS</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="flex-shrink-0 bg-white rounded-lg shadow p-4 w-48 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="bg-orange-500 text-white rounded px-2 py-1 text-sm inline-block mb-2">
              SPECIAL OFFER
            </div>
            <p className="mt-2 font-semibold text-lg">{promo.title}</p>
            <div className="mt-2">
              {/* Display value based on promotion type */}
              <p className="text-sm font-medium text-gray-700">
                {promo.type === 'BUY_GET' ? (
                  <span className="bg-green-100 text-green-600 py-1 px-2 rounded-full text-xs">
                    {promo.value} promo
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-600 py-1 px-2 rounded-full text-xs">
                    Save {promo.value}!
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

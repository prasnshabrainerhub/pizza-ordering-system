import React from 'react';
import { Pizza } from '../../types/types';
import Image from 'next/image';

interface PizzaCardProps {
  pizza: Pizza;
}

export const PizzaCard = ({ pizza }: PizzaCardProps) => {
  // Check if nutritionalInfo exists and is an object before using Object.entries
  const nutritionalInfo = pizza.nutritionalInfo && typeof pizza.nutritionalInfo === 'object'
    ? pizza.nutritionalInfo
    : {};

  return (
    <div className="bg-white text-black rounded-lg shadow-lg p-4">
      <Image
        src={pizza.image}
        alt={pizza.name}
        width={pizza.width}
        height={pizza.height}
        className="w-full h-48 object-cover rounded-lg"
      />
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{pizza.name}</h3>
          <span className="text-green-600 font-bold">₹{pizza.price}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{pizza.description}</p>
        <div className="mt-4">
          <p className="text-xs text-gray-500">
            Nutritional Information (Per 100 Gms):
            {Object.entries(nutritionalInfo).length > 0 ? (
              Object.entries(nutritionalInfo).map(([key, value]) => (
                <span key={key} className="ml-1">
                  {key}: {value},
                </span>
              ))
            ) : (
              <span>No nutritional information available</span>
            )}
          </p>
        </div>
        <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
          Customize
        </button>
      </div>
    </div>
  );
};

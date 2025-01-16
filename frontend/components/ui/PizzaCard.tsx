import React from 'react';
import Image from 'next/image';
import { Pizza } from '../../types/types';
import {PizzaCustomizeModal} from './PizzaCustomization';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface PizzaCardProps {
  pizza: Pizza;
}

export const PizzaCard = ({ pizza }: PizzaCardProps) => {

  const { t } = useTranslation('common');
  const basePrice = pizza.base_price || 0;
  const sizes = pizza.sizes || [];
  const smallestSize = sizes.length > 0 ? sizes.reduce((prev, curr) => 
    prev.price < curr.price ? prev : curr
  ) : null;

  const displayPrice = smallestSize ? basePrice + smallestSize.price : basePrice;

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  

  const imageUrl = pizza.image_url 
    ? `${API_BASE_URL}/${pizza.image_url.replace(/^\//, '')}`
    : '/placeholder-pizza.jpg';

  return (
    <div className="bg-white text-black rounded-lg shadow-lg p-4">
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={pizza.name}
          fill  // Using fill instead of layout="fill" as it's the newer approach
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          className="rounded-lg object-cover"  // Moved objectFit to className
        />
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{pizza.name}</h3>
          <span className="text-green-600 font-bold">₹{displayPrice}</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{pizza.description}</p>
        {pizza.sizes && pizza.sizes.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">{t('Available sizes:')}</p>
            <div className="flex gap-2 mt-1">
              {pizza.sizes.map((size) => (
                <span key={size.size} className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {size.size}: ₹{basePrice + size.price}
                </span>
              ))}
            </div>
          </div>
        )}
        <button 
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          onClick={() => setIsModalOpen(true)}
        >
          {t('Customize')}
        </button>
      </div>
      
      <PizzaCustomizeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        pizza={pizza}
      />
    </div>
  );
};


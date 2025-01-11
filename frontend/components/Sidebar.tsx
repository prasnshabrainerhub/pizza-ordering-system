import React from 'react';

const menuItems = [
  { id: 'buy1get4', name: 'Buy 1 Get 4', icon: '🍕' },
  { id: 'veg', name: 'Veg', icon: '🥬' },
  { id: '3pizzas', name: '3 Pizzas Start @ 399 Rs', icon: '🎯' },
  { id: 'jainSpecial', name: 'Jain Special', icon: '🌱' },
  { id: 'mealsAndDeals', name: 'Meals And Deals', icon: '🍽️' },
  { id: 'vegPizza', name: 'Veg Pizza', icon: '🍕' },
  { id: 'halfAndHalf', name: 'Half & Half Pizza', icon: '◐' },
  { id: 'classicMania', name: 'Classic Mania', icon: '🏆' },
  { id: 'pasta', name: 'Pasta', icon: '🍝' },
  { id: 'garlicBread', name: 'Garlic Bread', icon: '🥖' },
  { id: 'sides', name: 'Sides', icon: '🍟' },
  { id: 'nonVeg', name: 'Non Veg', icon: '🥩' }
];

export const Sidebar = () => {
  return (
    <div style={{ width: '300px' }} className="bg-white text-black shadow-lg h-screen">
      <div className="p-4 bg-green-600 text-black">
        <h2 className="text-lg font-semibold">Category</h2>
      </div>
      <nav className="p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className="w-full text-left p-3 hover:bg-gray-100 rounded flex items-center gap-2"
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};


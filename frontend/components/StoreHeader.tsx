import React from 'react';
import { MapPin, Phone, Search } from 'lucide-react';

export const StoreHeader = () => {
  return (
    <div className="bg-white p-4 flex items-center justify-between border-b">
      {/* Left side - Store Info */}
      <div className="flex items-center gap-6">
        <div className="flex items-start gap-2">
          <MapPin className="text-gray-500 mt-1 flex-shrink-0" size={18} />
          <div>
            <h2 className="font-medium text-gray-800">Ahmedabad</h2>
            <p className="text-sm text-gray-600">Shop 24 Maple Trade Center nr, Surdhara Cir, Thaltej, Ahmedabad, Gujarat 380054</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="text-gray-500" size={18} />
          <span className="text-gray-600">123-456-789</span>
        </div>
      </div>

      {/* Center - Open Status */}
      <div className="flex items-center gap-4">
        <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm border border-green-200">
          <span className="font-medium">OPEN</span>
          <span className="text-xs ml-1">Open until 1:00 AM</span>
        </div>
      </div>

      {/* Right side - Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Menu"
            className="w-120 px-6 py-3 pl-10 border rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

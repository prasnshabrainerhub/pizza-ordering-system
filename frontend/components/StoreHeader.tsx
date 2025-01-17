import { useTranslation } from 'react-i18next';
import React from 'react';
import { Store, Phone, Search } from 'lucide-react';

export const StoreHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-4 flex gap-4">
      {/* First Box */}
      <div className="flex-1 p-4 border rounded-lg shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <Store className="text-gray-500 mt-1" size={16} />
            <div>
              <h2 className="font-bold text-gray-800">{t('Ahmedabad')}</h2>
              <p className="text-xs text-gray-500">
                {t('Shop 24 Maple Trade Center nr, Surdhara Cir, Thaltej, Ahmedabad, Gujarat 380054')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="text-gray-500" size={14} />
            <span className="text-sm text-gray-500">9809270404</span>
          </div>
          <div className="mt-1">
            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs border border-green-200">
              {t('Open till 1 AM')}
            </span>
          </div>
        </div>
      </div>

      {/* Second Box */}
      <div className="flex-1 p-4 border rounded-lg shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Menu"
            className="w-full px-4 py-2 pl-10 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default StoreHeader;
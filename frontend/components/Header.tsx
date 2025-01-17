import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, LogIn, MoreVertical, Home, User, Package } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { useRouter } from 'next/navigation';
import { clearUserData } from './SignUpModel';
import { LanguageSwitcher } from './LanguageSwitcher';

const FontImports = () => (
  <style jsx global>{`
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@400;500;600&display=swap');
  `}</style>
);

interface UserData {
  username: string;
  role: 'user' | 'admin';
}

const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const Header = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMainDropdownOpen, setIsMainDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const mainDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const getUserData = () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        const decodedToken = decodeJWT(accessToken);
        if (decodedToken) {
          // Update to use the correct fields from your JWT
          setUserData({
            username: decodedToken.username || '',
            role: decodedToken.role || 'user'
          });
        }
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mainDropdownRef.current && !mainDropdownRef.current.contains(event.target as Node)) {
        setIsMainDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleLogout = () => {
    clearUserData()
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUserData(null);
    setIsUserDropdownOpen(false);
    
    // Force a page refresh and redirect to home
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard';
    }
  };

  const handleOrdersClick = () => {
    router.push('/orders');
    setIsUserDropdownOpen(false);
  };

  return (
    <>
      <FontImports />
      <header className="bg-white text-gray-800 py-4 shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <nav className="container mx-auto flex justify-between items-center px-6">
          {/* Logo and Home Button Section */}
          <div className="flex items-center gap-12">
          <LanguageSwitcher />
            <button 
              className="flex items-center gap-2 hover:text-gray-600 transition-colors group" 
              onClick={() => router.push('/')}
            >
              <Home size={24} className="text-gray-800 group-hover:scale-110 transition-transform" />
            </button>
            <h1 
              className="text-4xl font-bold cursor-pointer text-gray-900 hover:text-gray-700 transition-colors font-['Dancing_Script'] hover:scale-105 transform transition-transform" 
              onClick={() => router.push('/')}
            >
              {t('Pizza Bliss')}
            </h1>
          </div>
          {/* Navigation Links */}
          <ul className="flex items-center gap-8 font-['Inter']">
            {!userData ? (
              <li>
                <button 
                  className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-all transform hover:scale-110"
                  onClick={() => setIsLoginModalOpen(true)}
                  title="Login"
                >
                  <LogIn size={24} className="text-gray-700" />
                </button>
              </li>
            ) : null}
            <li>
              <button 
                onClick={handleCartClick}
                className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-all transform hover:scale-110 relative"
                title="Cart"
              >
                <ShoppingCart size={24} className="text-gray-900" />              
                <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                </span>
              </button>
            </li>
            {userData && (
              <li>
                <div className="relative" ref={userDropdownRef}>
                  <button 
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all hover:scale-105"
                  >
                    <User size={20} />
                    <span className="text-sm font-medium">{t('Hi,')} {userData.username}</span>
                    {userData.role === 'admin' && (
                      <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded">{t('Admin')}</span>
                    )}
                  </button>
                  
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50 border">
                      <div className="py-1">
                        <button 
                          onClick={handleOrdersClick}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                        >
                          <Package size={16} />
                          {t('Orders')}
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                        >
                          <span>🚪</span>
                          {t('Logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            )}
            <div className="relative" ref={mainDropdownRef}>
              <button 
                onClick={() => setIsMainDropdownOpen(!isMainDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-all transform hover:scale-110"
                title="Menu"
              >
                <MoreVertical size={24} />
              </button>
              
              {isMainDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border">
                  <div className="py-1">
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
                      <span>ℹ️</span>
                      {t('About Us')}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
                      <span>🔒</span>
                      {t('Privacy Policy')}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
                      <span>📋</span>
                      {t('Terms and Conditions')}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors">
                      <span>💰</span>
                      {t('Refund & Cancellation')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ul>
        </nav>
      </header>
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};
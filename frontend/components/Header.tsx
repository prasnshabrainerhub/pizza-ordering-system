import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, LogIn, MapPin, MoreVertical, Home, User } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext'; 
import Link from 'next/link';

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

// Add interface for user data
interface UserData {
  email: string;
  role: 'user' | 'admin';
}

export const Header = () => {
  const router = useRouter();
  const { state } = useCart();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Calculate total items in cart
  const cartItemsCount = state.items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    // Get user data from access token on component mount
    const getUserData = () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        const decodedToken = decodeJWT(accessToken);
        if (decodedToken) {
          setUserData(decodedToken);
        }
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUserData(null);
    // Add any additional logout logic here
  };

  return (
    <>
      <header className="bg-red-500 text-white py-4 z-10 relative">
        <nav className="container mx-auto flex justify-between items-center px-4">
          <Link href='/' className='absolute left-20'>
            <Home size={24} className='text-white' />
          </Link>
          <h1 className="text-2xl font-bold cursor-pointer" onClick={() => router.push('/')}>
            Pizza Bliss
          </h1>
          <ul className="flex items-center gap-8 text-lg">
            <li>
              <button className="flex items-center gap-2 hover:text-gray-200">
                <MapPin size={24} />
                <span>Change Store</span>
              </button>
            </li>
            {!userData ? (
              <li>
                <button 
                  className="flex items-center gap-2 hover:text-gray-200"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <LogIn size={24} />
                  <span>Login</span>
                </button>
              </li>
            ) : null}
            <li className="ml-auto gap-8">
              <button 
                onClick={handleCartClick}
                className="flex items-center gap-2 bg-white text-red-500 px-4 py-2 rounded-lg hover:bg-gray-100 relative"
              >
                <ShoppingCart size={24} />
                <span>Cart</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </li>
            {userData && (
              <li>
               <div className="flex items-center gap-2 px-3 py-2 bg-white text-red-500 rounded-lg">
                  <User size={20} />
                  <span>{userData.email}</span>
                  {userData.role === 'admin' && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">Admin</span>
                  )}
                </div>
              </li>
            )}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <MoreVertical size={20} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 justify-end mt-2 w-56 bg-white rounded shadow-lg z-50 border">
                  <div className="py-1">
                    {userData && (
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <span>🚪</span>
                        Logout
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <span>ℹ️</span>
                      About Us
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <span>🔒</span>
                      Privacy Policy
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <span>📋</span>
                      Terms and Conditions
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <span>💰</span>
                      Refund & Cancellation
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
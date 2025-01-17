import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { authApi } from '../utils/auth';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserData {
  email: string;
  username: string;
  phone_number: string;
  address: string;
  role: string;
}

interface ErrorDetail {
  msg: string;
}

interface ApiErrorData {
  detail: ErrorDetail[] | string;
}

interface ApiError {
  data: ApiErrorData;
}

const storeUserData = (userData: UserData) => {
  localStorage.setItem('userData', JSON.stringify(userData));
};

export const clearUserData = () => {
  localStorage.removeItem('userData');
};

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    phone_number: '',
    address: '',
    role: 'user' as const,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      const response = await authApi.register(formData);
      console.log(response);
      const userDataToStore: UserData = {
        email: formData.email,
        username: formData.username,
        phone_number: formData.phone_number,
        address: formData.address,
        role: formData.role,
      };
      storeUserData(userDataToStore);
      onClose();
    } catch (err) {
      console.error('Detailed error in handleSubmit:', err);
      
      // Type guard to check if error matches our ApiError interface
      const isApiError = (error: unknown): error is ApiError => {
        return (
          typeof error === 'object' &&
          error !== null &&
          'data' in error &&
          typeof (error as { data: unknown }).data === 'object' &&
          'detail' in (error as { data: { detail?: unknown } }).data
        );
      };

      if (isApiError(err)) {
        if (Array.isArray(err.data.detail)) {
          const errorMessages = err.data.detail.map(error => error.msg).join(', ');
          setError(errorMessages);
        } else {
          setError(err.data.detail || 'Registration failed');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-6">{t('Sign Up to Continue')}</h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Enter Your Full Name"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="phone_number"
              placeholder="Enter Your Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <input
              type="text"
              name="address"
              placeholder="Enter Your Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="user">{t('User')}</option>
              <option value="admin">{t('Admin')}</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
          >
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span>{t('Already have an account?')} </span>
          <button
            onClick={onClose}
            className="text-blue-500 hover:underline"
          >
            {('Login')}
          </button>
        </div>
      </div>
    </div>
  );
};
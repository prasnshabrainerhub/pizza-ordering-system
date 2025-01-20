import React from 'react';
import { useState, useEffect } from 'react';
import { useCart } from '../components/CartContext';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Header } from '../components/Header';
import CartPromotions from "../components/CartPromotions";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Coupon, DiscountType } from '../types/types';
import { GetServerSideProps } from 'next';


const Cart = () => {
  const { t } = useTranslation('common');
  const { items, removeFromCart, updateQuantity } = useCart();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [error, setError] = useState('');

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
        
        const data: Coupon[] = await response.json();
        const activeCoupons = data.filter((coupon: Coupon) => {
          const now = new Date();
          const validFrom = new Date(coupon.valid_from);
          const validUntil = new Date(coupon.valid_until);
          return validFrom <= now && now <= validUntil;
        });
        
        setCoupons(activeCoupons);
      } catch (err) {
        console.error('Error fetching coupons:', err);
      } finally {
        setLoadingCoupons(false);
      }
    };
    
    fetchCoupons();
  }, []);

  const calculateSubTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = calculateSubTotal();
    
    if (subtotal < appliedCoupon.min_order_value) {
      setError(`Minimum order value of ₹${appliedCoupon.min_order_value} required`);
      setAppliedCoupon(null);
      return 0;
    }

    let discount = 0;
    if (appliedCoupon.discount_type === DiscountType.PERCENTAGE) {
      discount = (subtotal * appliedCoupon.discount_value) / 100;
      if (appliedCoupon.max_discount && discount > appliedCoupon.max_discount) {
        discount = appliedCoupon.max_discount;
      }
    } else {
      discount = appliedCoupon.discount_value;
    }
    
    return Math.min(discount, subtotal);
  };

  const handleApplyCoupon = (coupon: Coupon) => {
    setError('');
    
    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      setError('This coupon has reached its usage limit');
      return;
    }

    if (calculateSubTotal() < coupon.min_order_value) {
      setError(`Minimum order value of ₹${coupon.min_order_value} required`);
      return;
    }

    setAppliedCoupon(coupon);
  };

  const calculateGST = () => {
    return (calculateSubTotal() - calculateDiscount()) * 0.05;
  };

  const calculateRoundOff = () => {
    const total = calculateSubTotal() - calculateDiscount() + calculateGST();
    return Math.round(total) - total;
  };

  const calculateTotal = () => {
    return Math.round(calculateSubTotal() - calculateDiscount() + calculateGST() + calculateRoundOff());
  };



  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-6xl mx-auto p-4">
          <Link href="/dashboard" className="inline-flex items-center gap-2 mb-6 text-green-600">
            <ArrowLeft size={24} />
            <span className="font-medium">{t('Back')}</span>
          </Link>

          <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow p-8">
            <ShoppingBag size={64} className="text-gray-400 mb-4" />
            <h2 className="text-2xl font-medium text-gray-800 mb-2">{t('Your cart is empty')}</h2>
            <p className="text-gray-600 mb-6">{t('Add some delicious pizzas to your cart!')}</p>
            <Link 
              href="/dashboard" 
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              {t('Start Ordering')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="max-w-6xl mx-auto p-4">
        <Link href="/dashboard" className="inline-flex items-center gap-2 mb-6 text-green-600">
          <ArrowLeft size={24} />
          <span className="font-medium">{t('Back')}</span>
        </Link>

        <div className="grid grid-cols-1 text-gray-800 md:grid-cols-2 gap-6">
          {/* Left side - Cart Items */}
          <div className="space-y-6">
            {/* Items Container */}
            <div className="bg-white rounded-lg shadow p-6">
              {items.map((item, index) => (
                <div key={`${item.pizzaId}-${item.size}-${item.variant}`} 
                     className={`${index !== items.length - 1 ? 'border-b mb-4 pb-4' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.size && `Size: ${item.size}`}
                        {item.variant && `, Variant: ${item.variant}`}
                      </p>
                      {item.toppings?.length > 0 && (
                        <div className="text-sm text-gray-500 mb-2">
                          {item.toppings.map((topping, index) => (
                            <div key={index}>{topping}</div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.pizzaId, Math.max(0, item.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.pizzaId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium mb-2">₹{item.price * item.quantity}.00</div>
                      <button
                        onClick={() => removeFromCart(item.pizzaId)}
                        className="text-red-500"
                      >
                        <span className="sr-only">{t('Remove')}</span>
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Instructions Box */}
            <div className="bg-white rounded-lg shadow p-6">
              <textarea
                placeholder="Mention your special instructions here..."
                className="w-full p-3 border rounded-lg text-sm text-gray-600"
                rows={3}
              />
            </div>
          </div>

          {/* Right side - Order Summary */}
          <div className="space-y-6">
            {/* Offers Box */}
            <CartPromotions 
              coupons={coupons}
              onApplyCoupon={handleApplyCoupon}
              loading={loadingCoupons}
            />

            {/* My Basket Box */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-medium mb-6">{t('My Basket')}</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>{t('Sub Total:')}</span>
                  <span>₹{calculateSubTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('Discounts:')}</span>
                  <span className="text-green-600">-₹{calculateDiscount()}</span>
                </div>
                {error && (
                  <div className="text-red-500 text-sm">
                    {error}
                  </div>
                )}
                {appliedCoupon && (
                  <div className="text-green-600 text-sm">
                    {t('Coupon applied')}: {appliedCoupon.code}
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t('GST')}:</span>
                  <span>₹{calculateGST().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('Round Off')}:</span>
                  <span>₹{calculateRoundOff().toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-medium text-lg">
                    <span>{t('Total To Pay:')}</span>
                    <span className="text-green-600">₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <button className="w-full py-3 bg-green-600 text-white rounded-lg">
                    {t('Delivery')}
                  </button>
                  <button className="w-full py-3 border border-green-600 text-green-600 rounded-lg">
                    {t('Pick up')}
                  </button>
                </div>
                <Link href="/checkout" className="w-full py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                  <span>{t('CHECKOUT!')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let { locale } = context;
  
  if (!locale) {
    locale = 'en'; // Default to 'en' if locale is not provided
  }
  
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default Cart;
import React from 'react';
import { useCart } from '../components/CartContext';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Header } from '../components/Header';

const Cart = () => {
  const { items, removeFromCart, updateQuantity } = useCart();

  const calculateSubTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateGST = () => {
    return calculateSubTotal() * 0.05;
  };

  const calculateRoundOff = () => {
    const total = calculateSubTotal() + calculateGST();
    return Math.round(total) - total;
  };

  const calculateTotal = () => {
    return Math.round(calculateSubTotal() + calculateGST() + calculateRoundOff());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="max-w-6xl mx-auto p-4">
        <Link href="/dashboard" className="inline-flex items-center gap-2 mb-6 text-green-600">
          <ArrowLeft size={24} />
          <span className="font-medium">Back</span>
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
                            <div key={index}>{topping} - 0</div>
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
                        <span className="sr-only">Remove</span>
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
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1 bg-black text-white rounded">%</span>
                <span className="font-medium">Buy 2 Get 1 Free</span>
              </div>
              <p className="text-sm text-gray-600">Select Minimum 3 Products.</p>
              <div className="flex justify-between mt-4">
                <button className="text-green-600 font-medium">Apply</button>
                <button className="text-green-600 font-medium">View More Offers</button>
              </div>
            </div>

            {/* My Basket Box */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="font-medium mb-6">My Basket</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span>Sub Total:</span>
                  <span>₹{calculateSubTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discounts:</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between">
                  <span>GST:</span>
                  <span>₹{calculateGST().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Round Off:</span>
                  <span>₹{calculateRoundOff().toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total To Pay:</span>
                    <span className="text-green-600">₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <button className="w-full py-3 bg-green-600 text-white rounded-lg">
                    Delivery
                  </button>
                  <button className="w-full py-3 border border-green-600 text-green-600 rounded-lg">
                    Pick up
                  </button>
                </div>
                <Link href="/checkout" className="w-full py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2">
                <span>CHECKOUT!</span>
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

export default Cart;
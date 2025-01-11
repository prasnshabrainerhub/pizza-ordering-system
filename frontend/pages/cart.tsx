'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { state } = useCart();
  
  // Calculate totals
  const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const GST = subtotal * 0.1; // Assuming 10% GST
  const roundOff = Math.round((subtotal + GST) * 100) / 100 - (subtotal + GST);
  const total = subtotal + GST + roundOff;

  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="flex items-center text-red-500 hover:text-red-600">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
        </div>

        {state.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Cart is currently empty</h2>
            <p className="text-gray-500">Looks like you haven&apos;t made your choices yet...</p>
            <Link href="/menu" className="mt-4 inline-block">
              <Button className="bg-red-500 hover:bg-red-600">Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {/* Add quantity decrease handler */}}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {/* Add quantity increase handler */}}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full md:w-80">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-lg mb-4">My Basket</h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Sub Total:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discounts:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>GST:</span>
              <span>${GST.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Round Off:</span>
              <span>${roundOff.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-3 border-t">
              <span>Total To Pay:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">Pick up</Button>
              <Button className="bg-red-500 hover:bg-red-600">Delivery</Button>
            </div>
            <Button className="w-full bg-red-500 hover:bg-red-600">
              CHECKOUT!
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
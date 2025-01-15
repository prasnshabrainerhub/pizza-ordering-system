import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (pizzaId: string) => void;
  updateQuantity: (pizzaId: string, quantity: number) => void;
  clearCart: () => void;
  setCurrentUser: (userId: string | null) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  setCurrentUser: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = window.localStorage.getItem('currentUser');
      if (storedUser) {
        const userId = JSON.parse(storedUser);
        setCurrentUser(userId);

        const userCart = window.localStorage.getItem(`cart_${userId}`);
        if (userCart && items.length === 0) {
          try {
            setItems(JSON.parse(userCart));
          } catch (e) {
            console.error('Error loading cart:', e);
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && currentUser) {
      try {
        window.localStorage.setItem(`cart_${currentUser}`, JSON.stringify(items));
      } catch (e) {
        console.error('Error saving cart:', e);
      }
    }
  }, [items, currentUser]);

  const addToCart = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(item =>
        item.pizzaId === newItem.pizzaId &&
        item.size === newItem.size &&
        item.variant === newItem.variant
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
        };
        return updatedItems;
      }

      return [...currentItems, newItem];
    });
  };

  const removeFromCart = (pizzaId: string) => {
    setItems(currentItems => currentItems.filter(item => item.pizzaId !== pizzaId));
  };

  const updateQuantity = (pizzaId: string, quantity: number) => {
    setItems(currentItems =>
      quantity === 0
        ? currentItems.filter(item => item.pizzaId !== pizzaId)
        : currentItems.map(item =>
            item.pizzaId === pizzaId ? { ...item, quantity } : item
          )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== 'undefined' && currentUser) {
      window.localStorage.removeItem(`cart_${currentUser}`);
    }
  };

  const handleUserChange = (userId: string | null) => {
    if (userId !== currentUser) {
      setCurrentUser(userId);

      if (userId) {
        if (typeof window !== 'undefined') {
          const userCart = window.localStorage.getItem(`cart_${userId}`);
          if (userCart) {
            try {
              setItems(JSON.parse(userCart));
              return;
            } catch (e) {
              console.error('Error loading cart:', e);
            }
          }
        }
        setItems([]); // Initialize empty cart if no saved cart exists
      } else {
        setItems([]); // Clear cart on logout
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('currentUser');
        }
      }
    }
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setCurrentUser: handleUserChange,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
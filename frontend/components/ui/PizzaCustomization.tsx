import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useCart } from '.././CartContext';
import { CartItem } from '../../types/types';

enum PizzaSizeEnum {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

// Define default sizes since API doesn't provide sizes
const DEFAULT_SIZES: Size[] = [
  { size: PizzaSizeEnum.SMALL, price: 0 },
  { size: PizzaSizeEnum.MEDIUM, price: 50 },
  { size: PizzaSizeEnum.LARGE, price: 100 },
];

interface Size {
  size: PizzaSizeEnum;
  price: number;
}

interface Pizza {
  pizza_id: string;  // Updated to match API response
  name: string;
  description: string;
  base_price: number;
  image_url: string;
  category: string;
}

interface Topping {
  topping_id: string;
  name: string;
  price: number;
  is_vegetarian: boolean;
}

interface PizzaCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  pizza: Pizza;
}

const API_BASE_URL = 'http://localhost:8000';

export const PizzaCustomizeModal: React.FC<PizzaCustomizeModalProps> = ({ isOpen, onClose, pizza }) => {
  const [selectedSize, setSelectedSize] = useState<PizzaSizeEnum | ''>('');
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [selectedVariant, setSelectedVariant] = useState('regular pan');
  const [isLoading, setIsLoading] = useState(true);

  // Fix the image URL by ensuring it starts with a forward slash
  const imageUrl = pizza.image_url && typeof pizza.image_url === 'string' 
    ? `${API_BASE_URL}/${pizza.image_url.startsWith('/') ? pizza.image_url.slice(1) : pizza.image_url}`
    : '/placeholder-pizza.jpg';

  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen) {
      setSelectedSize('');
      setSelectedToppings([]);
      setSelectedVariant('regular pan');
      fetchToppings();
    }
  }, [isOpen]);

  const fetchToppings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/toppings`);
      if (response.ok) {
        const data = await response.json();
        setToppings(data);
      }
    } catch (error) {
      console.error('Error fetching toppings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !pizza) return null;

  const calculateTotalPrice = () => {
    const sizePrice = DEFAULT_SIZES.find(s => s.size === selectedSize)?.price || 0;
    const toppingsPrice = selectedToppings.reduce((total, topping) => total + topping.price, 0);
    return (pizza.base_price || 0) + sizePrice + toppingsPrice;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      console.log('Missing required field: selectedSize');
      return;
    }

    const selectedSizeData = DEFAULT_SIZES.find(s => s.size === selectedSize);
    
    if (!selectedSizeData) {
      console.log('Invalid size selected');
      return;
    }

    const cartItem: CartItem = {
      pizzaId: pizza.pizza_id, // Updated to match API response
      name: pizza.name,
      size: selectedSize,
      variant: selectedVariant,
      toppings: selectedToppings.map(t => t.name),
      quantity: 1,
      price: calculateTotalPrice(),
      imageUrl: pizza.image_url.startsWith('/') ? pizza.image_url : `/${pizza.image_url}` // Ensure leading slash
    };

    try {
      addToCart(cartItem);
      console.log('Cart item created:', cartItem);
      alert('Added to cart successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="p-2 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Customize Your Pizza</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Pizza Image and Info */}
          <div className="flex gap-4 mb-4">
            <div className="w-1/2 relative h-32 rounded-lg overflow-hidden">
              <Image 
                src={imageUrl}
                alt={pizza.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="w-1/2">
              <h3 className="font-medium">{pizza.name}</h3>
              <p className="text-gray-600 text-xs mt-1">{pizza.description}</p>
              <p className="text-gray-600 text-xs mt-1">Base Price: ₹{pizza.base_price}</p>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Select Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {DEFAULT_SIZES.map((sizeOption) => {
                const price = (pizza.base_price || 0) + (sizeOption.price || 0);
                
                return (
                  <button
                    key={sizeOption.size}
                    onClick={() => setSelectedSize(sizeOption.size)}
                    className={`p-2 border rounded-lg text-left ${
                      selectedSize === sizeOption.size ? 'border-green-600 bg-green-50' : ''
                    }`}
                  >
                    <div className="text-sm font-medium capitalize">{sizeOption.size}</div>
                    <div className="text-xs text-gray-500">
                      {sizeOption.size === PizzaSizeEnum.SMALL ? 'serves 1, 17.7 Cm' :
                       sizeOption.size === PizzaSizeEnum.MEDIUM ? 'serves 2, 24.5 Cm' :
                       'serves 4, 33 Cm'}
                    </div>
                    <div className="text-sm mt-1">₹ {price}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Choice of Pizza */}
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Choice Of Pizza</h3>
            <p className="text-xs text-gray-500 mb-2">You can choose up to 1 option(s)</p>
            <div className="space-y-2">
              {['Regular Pan', 'Thin Crust'].map((variant) => (
                <label key={variant} className="flex items-center justify-between p-2 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="variant"
                      value={variant.toLowerCase()}
                      checked={selectedVariant === variant.toLowerCase()}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="w-3 h-3 text-green-600"
                    />
                    <span className="text-sm">{variant}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Toppings */}
          {!isLoading && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Extra Toppings</h3>
              <p className="text-xs text-gray-500 mb-2">You can choose multiple toppings</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {toppings.map((topping) => (
                  <label key={topping.topping_id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedToppings.some(t => t.topping_id === topping.topping_id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedToppings([...selectedToppings, topping]);
                          } else {
                            setSelectedToppings(selectedToppings.filter(t => t.topping_id !== topping.topping_id));
                          }
                        }}
                        className="w-3 h-3 text-green-600"
                      />
                      <span className="text-sm">{topping.name}</span>
                    </div>
                    <span className="text-sm">₹ {topping.price}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Button */}
          <div className="sticky bottom-0 left-0 right-0 bg-white pt-2">
            <button 
              className={`w-full py-3 rounded-lg font-semibold ${
                selectedSize 
                  ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!selectedSize}
              onClick={handleAddToCart}
            >
              {selectedSize ? `ADD TO CART - ₹ ${calculateTotalPrice()}` : 'Please select a size'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
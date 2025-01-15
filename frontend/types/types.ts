enum PizzaSizeEnum {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

interface PizzaSize {
  size: PizzaSizeEnum;
  price: number;
}

export interface Pizza {
  name: string;
  description?: string;
  base_price: number;
  category: string;
  image_url: string;
  sizes: PizzaSize[];
  created_at?: Date;
  updated_at?: Date | null;
}

export interface Promotion {
  id: string;
  title: string;
  type: 'FLAT' | 'BUY_GET';
  value: string;
}

export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED = "fixed"
}

export interface Coupon {
  coupon_id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  description?: string;
  valid_from: Date;
  valid_until: Date;
  min_order_value: number;
  max_discount?: number;
  is_active: boolean;
  usage_limit?: number;
}

export type MenuItem = {
  id: string;
  name: string;
  icon: string;
  badge?: 'Popular' | 'New' | 'Deal' | 'Best';
};

export interface CartItem {
  pizzaId: string;
  name: string;
  size: string;
  variant: string;
  toppings: string[];
  quantity: number;
  price: number;
  imageUrl: string;
}

export const PIZZA_CATEGORIES = [
  { id: 'buy1get4', name: 'Buy 1 Get 4', icon: '🍕' },
  { id: 'vegPizza', name: 'Veg Pizza', icon: '🍕' },
  { id: 'nonVeg', name: 'Non Veg', icon: '🥩' },
  { id: 'classicMania', name: 'Classic Mania', icon: '🏆' },
  { id: 'drinks', name: 'Drinks', icon: '🍹' },
] as const;

export type PizzaCategory = typeof PIZZA_CATEGORIES[number]['id'];
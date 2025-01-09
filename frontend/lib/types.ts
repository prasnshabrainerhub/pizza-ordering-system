export enum UserRole {
    ADMIN = "admin",
    USER = "user",
  }
  
  export enum OrderStatus {
    RECEIVED = "received",
    PREPARING = "preparing",
    BAKING = "baking",
    READY = "ready",
    DELIVERED = "delivered",
  }
  
  export enum PizzaSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
  }
  
  export interface User {
    user_id: string;
    email: string;
    username: string;
    role: UserRole;
    phone_number?: string;
    address?: string;
  }
  
  export interface Pizza {
    pizza_id: string;
    name: string;
    description: string;
    base_price: number;
    image_url: string;
    toppings: Topping[];
    sizes: PizzaSize[];
  }
  
  export interface Topping {
    topping_id: string;
    name: string;
    price: number;
    is_vegetarian: boolean;
  }
  
  export interface Order {
    order_id: string;
    user_id: string;
    total_amount: number;
    order_date: string;
    status: OrderStatus;
    items: OrderItem[];
  }
  
  export interface OrderItem {
    item_id: string;
    pizza_id: string;
    quantity: number;
    custom_toppings: Topping[];
    item_price: number;
  }
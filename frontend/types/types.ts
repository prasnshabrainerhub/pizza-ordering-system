export interface Pizza {
  id: string;
  name: string;
  price: number;
  description: string;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    fat: number;
    cholesterol: number;
    carbohydrate: number;
    sugar: number;
    protein: number;
  };
  image: string;
}

export interface Promotion {
  id: string;
  title: string;
  type: 'FLAT' | 'BUY_GET';
  value: string;
}
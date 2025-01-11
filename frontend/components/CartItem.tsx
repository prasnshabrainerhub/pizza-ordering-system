import { Button } from '@/components/ui/button';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ id, name, price, quantity, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-b-0">
      <div className="flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-gray-500">${price.toFixed(2)}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(id, quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(id, quantity + 1)}
          >
            +
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700"
          onClick={() => onRemove(id)}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
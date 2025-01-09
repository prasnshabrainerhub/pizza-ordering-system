"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { PizzaSize, Topping } from "@/lib/types"

const PizzaDetail = ({ params }: { params: { pizzaId: string } }) => {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>(PizzaSize.MEDIUM)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()

  const sizes = [
    { id: PizzaSize.SMALL, name: "Small", price: 12.99 },
    { id: PizzaSize.MEDIUM, name: "Medium", price: 14.99 },
    { id: PizzaSize.LARGE, name: "Large", price: 16.99 },
  ]

  const toppings: Topping[] = [
    { topping_id: "1", name: "Extra Cheese", price: 1.5, is_vegetarian: true },
    { topping_id: "2", name: "Pepperoni", price: 2, is_vegetarian: false },
    { topping_id: "3", name: "Mushrooms", price: 1.5, is_vegetarian: true },
  ]

  const calculateTotal = () => {
    const basePrice = sizes.find(s => s.id === selectedSize)?.price || 0
    const toppingsPrice = selectedToppings.reduce((acc, toppingId) => {
      const topping = toppings.find(t => t.topping_id === toppingId)
      return acc + (topping?.price || 0)
    }, 0)
    return (basePrice + toppingsPrice) * quantity
  }

  const handleAddToCart = () => {
    // Add to cart logic here
    router.push("/cart")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src="/api/placeholder/500/500"
            alt="Pizza"
            className="rounded-lg w-full"
          />
        </div>
        
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-4">Margherita Pizza</h1>
          <p className="text-gray-600 mb-6">
            Fresh mozzarella, tomatoes, and basil on our signature crust
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Select Size</h3>
              <RadioGroup
                value={selectedSize}
                onValueChange={(value) => setSelectedSize(value as PizzaSize)}
                className="grid grid-cols-3 gap-4"
              >
                {sizes.map((size) => (
                  <div key={size.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={size.id} id={size.id} />
                    <label htmlFor={size.id} className="text-sm">
                      {size.name} (${size.price})
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Extra Toppings</h3>
              <div className="grid grid-cols-2 gap-4">
                {toppings.map((topping) => (
                  <div key={topping.topping_id} className="flex items-center space-x-2">
                    <Checkbox
                      id={topping.topping_id}
                      checked={selectedToppings.includes(topping.topping_id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedToppings([...selectedToppings, topping.topping_id])
                        } else {
                          setSelectedToppings(selectedToppings.filter(id => id !== topping.topping_id))
                        }
                      }}
                    />
                    <label htmlFor={topping.topping_id} className="text-sm">
                      {topping.name} (+${topping.price})
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="text-lg font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-semibold">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              <Button 
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PizzaDetail
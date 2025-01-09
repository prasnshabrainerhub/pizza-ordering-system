"use client"

import { useState, useEffect } from "react"
import { Pizza } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MenuPage() {
  const [pizzas, setPizzas] = useState<Pizza[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await fetch("/api/pizzas")
        const data = await response.json()
        setPizzas(data)
      } catch (error) {
        console.error("Failed to fetch pizzas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPizzas()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Pizza Menu</h1>
      
      {/* Categories */}
      <div className="flex overflow-x-auto space-x-4 mb-8 pb-4">
        <Button variant="outline" className="whitespace-nowrap">All Pizzas</Button>
        <Button variant="outline" className="whitespace-nowrap">Vegetarian</Button>
        <Button variant="outline" className="whitespace-nowrap">Non-Vegetarian</Button>
        <Button variant="outline" className="whitespace-nowrap">Specialty</Button>
      </div>

      {/* Pizza Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pizzas.map((pizza) => (
          <Card key={pizza.pizza_id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img
                src={pizza.image_url || "/api/placeholder/400/300"}
                alt={pizza.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold mb-2">{pizza.name}</h3>
              <p className="text-gray-600 mb-4">{pizza.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-lg font-bold">
                  Starting from ${pizza.base_price.toFixed(2)}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full">
                <Link href={`/menu/${pizza.pizza_id}`}>Customize & Order</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
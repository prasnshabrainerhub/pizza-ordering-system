"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Add your checkout logic here
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push("/dashboard/user/orders")
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Full Name" required />
              <Input placeholder="Phone Number" required type="tel" />
              <Input placeholder="Address" required />
              <Input placeholder="Apartment, suite, etc. (optional)" />
              
              <div className="space-y-2">
                <h3 className="font-medium">Delivery Time</h3>
                <RadioGroup defaultValue="asap">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="asap" id="asap" />
                    <label htmlFor="asap">As soon as possible</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <label htmlFor="scheduled">Schedule for later</label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="instructions" />
                <label htmlFor="instructions">Add delivery instructions</label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                {/* Order items will be mapped here */}
                <div className="flex justify-between">
                  <span>Large Pepperoni Pizza</span>
                  <span>$18.99</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$18.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>$3.99</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>$22.98</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
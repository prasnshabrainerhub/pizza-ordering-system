"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UserDashboard() {
  const orders = [
    {
      id: "1",
      date: "2024-01-09",
      status: "delivered",
      total: 22.98,
      items: ["Large Pepperoni Pizza"]
    }
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Button asChild>
              <Link href="/menu">Order Again</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                    <p className="text-sm mt-2">{order.items.join(", ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.total}</p>
                    <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-800">
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
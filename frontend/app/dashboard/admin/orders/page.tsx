"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [selectedStatus, setSelectedStatus] = useState("all")

  const orders = [
    {
      id: "1",
      customer: "John Doe",
      date: "2024-01-09",
      status: "preparing",
      total: 22.98,
      items: ["Large Pepperoni Pizza"]
    }
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <div className="flex gap-4">
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="p-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customer}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                  <p className="text-sm mt-2">{order.items.join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.total}</p>
                  <Select defaultValue={order.status}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
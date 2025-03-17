"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import SubscriptionReminderModal from "../_components/subscription-reminder"

export default function DashboardPage() {
  const [reminderOpen, setReminderOpen] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState(7) // Example value

  // Example expiry date (7 days from now)
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + daysRemaining)

  // Example handlers
  const handleRenew = () => {
    console.log("Renewing subscription")
    setReminderOpen(false)
    // In a real app, this would navigate to a payment page or process the renewal
  }

  const handleRemindLater = () => {
    console.log("Remind later clicked")
    setReminderOpen(false)
    // In a real app, this would set a cookie or localStorage value to remind again later
  }

  return (
    <div className="md:ms-64 p-5">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium mb-2">Test Subscription Reminder Modal</h2>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setDaysRemaining(2)
                setReminderOpen(true)
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Critical (2 days)
            </Button>

            <Button
              onClick={() => {
                setDaysRemaining(7)
                setReminderOpen(true)
              }}
              className="bg-amber-500 hover:bg-amber-600"
            >
              High (7 days)
            </Button>

            <Button
              onClick={() => {
                setDaysRemaining(14)
                setReminderOpen(true)
              }}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              Medium (14 days)
            </Button>

            <Button
              onClick={() => {
                setDaysRemaining(25)
                setReminderOpen(true)
              }}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Low (25 days)
            </Button>
          </div>
        </div>
      </div>

      {/* Subscription Reminder Modal */}
      <SubscriptionReminderModal
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        daysRemaining={daysRemaining}
        expiryDate={expiryDate}
        planName="Professional"
        onRenew={handleRenew}
        onRemindLater={handleRemindLater}
      />
    </div>
  )
}


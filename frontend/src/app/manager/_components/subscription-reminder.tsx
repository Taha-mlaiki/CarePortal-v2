"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Calendar, Clock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type SubscriptionReminderProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  daysRemaining: number
  expiryDate: Date
  planName: string
  onRenew: () => void
  onRemindLater: () => void
}

export default function SubscriptionReminderModal({
  open,
  onOpenChange,
  daysRemaining,
  expiryDate,
  planName,
  onRenew,
  onRemindLater,
}: SubscriptionReminderProps) {
  const [progress, setProgress] = useState(0)

  // Animate progress bar on open
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setProgress(100 - (daysRemaining / 30) * 100)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [open, daysRemaining])

  // Get urgency level based on days remaining
  const getUrgencyLevel = () => {
    if (daysRemaining <= 3) return "critical"
    if (daysRemaining <= 7) return "high"
    if (daysRemaining <= 14) return "medium"
    return "low"
  }

  const urgency = getUrgencyLevel()

  // Format expiry date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(expiryDate)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-gradient-to-br from-white to-gray-50">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#3b82f6]/10 rounded-full blur-xl" />
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />

        <div className="relative p-6">
          {/* Header with countdown */}
          <DialogHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge
                className={cn(
                  "px-3 py-1 text-sm font-medium",
                  urgency === "critical" && "bg-red-500 hover:bg-red-600",
                  urgency === "high" && "bg-amber-500 hover:bg-amber-600",
                  urgency === "medium" && "bg-yellow-500 hover:bg-yellow-600",
                  urgency === "low" && "bg-blue-500 hover:bg-blue-600",
                )}
              >
                <Clock className="mr-1 h-3.5 w-3.5" />
                {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining
              </Badge>
            </div>

            <DialogTitle className="text-2xl font-bold mt-4">
              Your {planName} Subscription is Expiring Soon!
            </DialogTitle>

            <DialogDescription className="text-base mt-2">
              Don&apos;t lose access to your cabinet management tools and patient data.
            </DialogDescription>
          </DialogHeader>

          {/* Subscription progress */}
          <div className="my-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Subscription Period</span>
              <span className="text-gray-500">Expires on {formattedDate}</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs mt-2">
              <span>Start Date</span>
              <span className="font-medium">Expiry Date</span>
            </div>
          </div>

          {/* Subscription details card */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-[#3b82f6]/10 p-3">
                <CreditCard className="h-6 w-6 text-[#3b82f6]" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Active Subscription</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your {planName} plan gives you access to all cabinet management features, patient records, and
                  appointment scheduling.
                </p>

                <div className="mt-4 flex items-start gap-2 text-sm">
                  <Calendar className="h-10 w-10 text-gray-400" />
                  <span>
                    Renew by <span className="font-medium">{formattedDate}</span> to maintain uninterrupted service
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning for critical expiry */}
          {urgency === "critical" && (
            <div className="mt-6 flex items-center gap-3 rounded-lg bg-red-50 p-3 text-red-800 border border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm font-medium">
                Your subscription expires in {daysRemaining} {daysRemaining === 1 ? "day" : "days"}! Renew now to avoid
                service interruption.
              </p>
            </div>
          )}

          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="sm:w-auto w-full" onClick={onRemindLater}>
              Remind Me Later
            </Button>

            <AnimatePresence>
              <motion.div
                className="sm:w-auto w-full"
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, 1.03, 1],
                  transition: {
                    repeat: urgency === "critical" ? Number.POSITIVE_INFINITY : 0,
                    repeatDelay: 2,
                  },
                }}
              >
                <Button
                  className={cn(
                    "sm:w-auto w-full",
                    urgency === "critical" ? "bg-red-500 hover:bg-red-600" : "bg-[#3b82f6] hover:bg-[#3b82f6]/90",
                  )}
                  onClick={onRenew}
                >
                  Renew Subscription Now
                </Button>
              </motion.div>
            </AnimatePresence>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}


"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ChevronRight, Star } from "lucide-react";
import { toast } from "sonner";

// Define the shared features list
const sharedFeatures = [
  "Appointment scheduling",
  "Patient reminders",
  "Multi-doctor support",
  "Advanced analytics",
  "Priority support",
];

// Pricing plans data
const pricingPlans = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$49",
    period: "month",
    billingFrequency: "Monthly",
    description:
      "Perfect for new practices or those who prefer monthly billing.",
    isPopular: false,
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "$490",
    period: "year",
    billingFrequency: "Annually",
    description:
      "Our most popular plan - save 16% compared to monthly billing.",
    isPopular: true,
    savings: "Save 16%",
    equivalent: "$40.83/month",
  },
];

export default function PricingPage() {
  // Function to handle subscription button click
  const handleSubscribe = (planId: string) => {
    const plan = pricingPlans.find((p) => p.id === planId);
    if (plan) {
      console.log(`Subscribed to ${plan.name} Plan`);
      toast.success(`Thank you for subscribing to the ${plan.name} Plan!`, {
        description: `You've selected the ${plan.billingFrequency.toLowerCase()} billing option.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-5 text-xl text-gray-600 dark:text-gray-300">
            Choose the plan that works best for your healthcare practice. All
            plans include our full feature set.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.isPopular
                  ? "border-blue-500 dark:border-blue-600 shadow-lg shadow-blue-100 dark:shadow-blue-900/20"
                  : "border-gray-200 dark:border-gray-800"
              } hover:scale-105`}
            >
              <div>
                {/* Best Value Badge */}
                {plan.isPopular && (
                  <div className="absolute -right-12 top-7 rotate-45 bg-blue-500 text-white text-xs py-1 px-12 shadow-md">
                    Best Value
                  </div>
                )}

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="mt-1.5 text-gray-600 dark:text-gray-300">
                        {plan.description}
                      </CardDescription>
                    </div>
                    {plan.isPopular && (
                      <Star className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="ml-1 text-gray-600 dark:text-gray-400">
                        /{plan.period}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Billed {plan.billingFrequency.toLowerCase()}
                    </p>

                    {/* Savings Badge */}
                    {plan.savings && (
                      <Badge className="mt-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900">
                        {plan.savings}
                      </Badge>
                    )}

                    {/* Monthly Equivalent */}
                    {plan.equivalent && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        Equivalent to {plan.equivalent}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white uppercase tracking-wider">
                      Includes:
                    </h4>
                    <ul className="space-y-3">
                      {sharedFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </div>

              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-6 text-base ${
                    plan.isPopular
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-white hover:bg-gray-100 text-gray-900 border border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700"
                  }`}
                >
                  <span>Subscribe Now</span>
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Satisfaction Guarantee */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
            30-day satisfaction guarantee. No questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}

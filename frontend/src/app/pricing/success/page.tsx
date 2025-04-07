"use client";

import { CheckCircleIcon } from "lucide-react";
import Link from "next/link";

export default function Success() {


  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="h-16 w-16 text-green-500 animate-bounce" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Thank you for your payment. You now have access to your cabinet. Enjoy
          your subscription!
        </p>

        {/* Button */}
        <Link
          href="/create-cabinet" 
          className="inline-block bg-green-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-green-700 transition duration-300"
        >
          Create cabinet
        </Link>

        {/* Decorative Dots */}
        <div className="mt-8 flex justify-center space-x-2">
          <span className="h-3 w-3 bg-green-300 rounded-full animate-pulse"></span>
          <span className="h-3 w-3 bg-green-400 rounded-full animate-pulse delay-100"></span>
          <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse delay-200"></span>
        </div>
      </div>
    </div>
  );
}

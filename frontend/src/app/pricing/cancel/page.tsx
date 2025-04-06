"use client";

import Link from "next/link";

export default function Cancel() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <svg
            className="h-16 w-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Canceled</h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          It looks like your payment didn’t go through. Don’t worry, you can try again anytime!
        </p>

        {/* Button */}
        <Link
          href="/pricing" // Adjust this URL to your pricing or checkout page
          className="inline-block bg-red-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-red-700 transition duration-300"
        >
          Try Again
        </Link>

        {/* Support Link */}
        <p className="mt-4 text-sm text-gray-500">
          Need help?{" "}
          <a href="/support" className="text-red-600 hover:underline">
            Contact Support
          </a>
        </p>

        {/* Decorative Border */}
        <div className="mt-6 border-t-2 border-red-200 w-16 mx-auto"></div>
      </div>
    </div>
  );
}
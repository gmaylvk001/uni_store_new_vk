"use client";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#77B6E7] to-[#5B3BB7] px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thank You!
        </h1>

        <p className="text-gray-600 mb-6">
          Your entry has been submitted successfully.  
          You’re now part of the LuckDrop draw.
        </p>
      </div>
    </div>
  );
}

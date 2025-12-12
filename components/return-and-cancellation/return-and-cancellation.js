"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { FiRotateCcw, FiPackage, FiCheckCircle, FiClock } from 'react-icons/fi';
import { MdOutlinePolicy, MdOutlineMoneyOff } from "react-icons/md";

const CancellationReturnPolicy = () => {
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  return (
    <div>
      {/* Header Bar */}
      <div className="bg-blue-50 py-6 px-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Return & Cancellation Policy</h2>
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
          <span className="text-gray-500">›</span>
          <span className="text-blue-600 font-semibold">Return & Cancellation</span>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-9xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiRotateCcw className="text-blue-600 text-3xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-customBlue mb-4">Return & Cancellation Policy</h1>
            {currentDate && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Last updated: {currentDate}
              </p>
            )}
          </div>

          {/* Policy Content */}
          <div className="rounded-xl shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Cancellation Policy */}
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-customBlue mb-4 flex items-center gap-2">
                <MdOutlinePolicy className="text-customBlue" /> Returns
              </h2>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold text-gray-800">1. Eligibility:</span>Products can be returned within 30 days of receipt if they are in their original condition, unused, and with all original packaging and tags.
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold text-gray-800">2. Process:</span>To initiate a return, please contact our customer service team with your order number and reason for return. We will provide you with a return authorisation and instructions.
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold text-gray-800">3. Shipping:</span> Customers are responsible for return shipping costs. We recommend using a trackable shipping service or purchasing shipping insurance, as we cannot guarantee that we will receive your returned item.
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-semibold text-gray-800">4. Refunds:</span> Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within a certain number of days.
              </p>
            </div>

            {/* Cancellation */}
            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiPackage className="text-2xl" />
                    Cancellations
                </h3>
                <p className="text-gray-600 mb-4">
                    <span className="font-semibold text-gray-800">1. Order Cancellation:</span>Orders can be cancelled before they are shipped. If you need to cancel an order, please contact our customer service team as soon as possible with your order number.
                </p>
                <p className="text-gray-600 mb-4">
                    <span className="font-semibold text-gray-800">2. Shipped Orders:</span> If your order has already been shipped, it cannot be cancelled. However, you can initiate a return once you have received the item.
                </p>
                <p className="text-gray-600 mb-4">
                    <span className="font-semibold text-gray-800">3. Refunds for Cancellations:</span> If your order is successfully cancelled before shipping, you will receive a full refund to your original method of payment.
                </p>
            </div>

            {/* Exceptions */}
            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FiPackage className="text-2xl" />
                    Exceptions
                </h3>
                <p className="text-gray-600 mb-4">
                    <span className="font-semibold text-gray-800">1. Non-returnable Items:</span>Certain items are non-returnable, such as perishable goods, custom-made products, and gift cards. Please check the product description for any exceptions before making a purchase.
                </p>
                <p className="text-gray-600 mb-4">
                    <span className="font-semibold text-gray-800">2. Damaged or Defective Items:</span> If you receive a damaged or defective item, please contact us immediately with your order number and a photo of the damage or defect. We will arrange for a replacement or refund.
                </p>
            </div>

            {/* Product Complaints */}
            <div className="p-8 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiCheckCircle className="text-2xl" />
                Product Complaints
              </h3>
              <p className="text-gray-600">
                In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 7 days of receiving the product. The Customer Service Team, after looking into your complaint will take an appropirate decision.
              </p>
            </div>

            {/* Warranty Items */}
            <div className="p-8 border-b border-gray-100 bg-blue-50/30">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiPackage className="text-2xl" />
                Warranty Products
              </h3>
              <p className="text-gray-600">
                In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.
              </p>
            </div>

            {/* Refund Processing */}
            <div className="p-8">
                <h3 className="text-xl font-semibold text-customBlue mb-3 flex items-center gap-2">
                    <FiClock className="text-customBlue" />Contact Us
                </h3>
                <p className="text-gray-600 mb-6">
                If you have any questions about our return and cancellation policy, please contact our customer service team at 9243585858 or info@uniletstores.com. We are here to assist you and ensure your satisfaction.
                </p>
                <a href="mailto:info@uniletstores.com" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300">Contact Customer Care</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationReturnPolicy;
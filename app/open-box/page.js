"use client";
import { left } from "@/public/assets/libs/@popperjs/core/esm";
import Image from "next/image";
import Link from "next/link";
import { FiBox } from "react-icons/fi";
import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";

export default function OpenBox() {
  return (
    <div>
        <div className="bg-blue-50 py-6 px-8 flex justify-between items-center">
            {/* <h2 className="text-xl font-bold text-gray-800"><FiBox className="text-xl" />Open Box</h2> */}
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800"><FiBox className="text-xl" />Open Box</h2>
            <div className="flex items-center space-x-2">
                <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
                <span className="text-gray-500">›</span>
                <span className="text-blue-600 font-semibold">Open Box</span>
            </div>
        </div>

        <div className="py-2 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-9xl mx-auto ">
                <div className=" rounded-xl shadow-md overflow-hidden animate-fade-in-up delay-100  bg-gradient-to-br from-blue-100 to-indigo-200">
                    <div className="p-3 border-b border-gray-100">
                        <h2 className="text-2xl font-bold text-customBlue mb-4 flex items-center gap-2">OPEN-BOX PRODUCTS : </h2>
                        <p className="text-black mb-4">The packaging of the product might have been opened and product is kept in-store for display purpose. These products are completely new, unused and comes with product warranty from manufacturer.</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center py-16">
                <img src="/uploads/no-product-new.png" alt="No products" className="w-48 mb-4"/>
                <span className="font-bold text-lg text-gray-700">
                    No Products Available for this Category
                </span>
            </div>
        </div>
    </div>
  );
}

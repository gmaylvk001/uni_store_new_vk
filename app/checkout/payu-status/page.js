"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

function PayUStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateCartCount } = useCart();
  const [isFinishing, setIsFinishing] = useState(true);

  const status = searchParams.get("status");
  const orderNumber = searchParams.get("order_number");
  const reason = searchParams.get("reason");
  const payuStatus = searchParams.get("payu_status");
  const unmappedStatus = searchParams.get("unmapped_status");
  const isSuccess = status === "success";

  useEffect(() => {
    const finalizeStatusPage = async () => {
      localStorage.removeItem("checkoutData");
      localStorage.removeItem("buyNowData");
      localStorage.removeItem("appliedCoupon");
      sessionStorage.removeItem("guestCheckoutVerification");
      updateCartCount(0);
      setIsFinishing(false);

      if (!isSuccess) {
        return;
      }

      const hasToken = Boolean(localStorage.getItem("token"));
      setTimeout(() => {
        router.replace(hasToken ? "/orders" : "/thank-you");
      }, 1800);
    };

    finalizeStatusPage();
  }, [isSuccess, router, updateCartCount]);

  return (
    <div className="min-h-screen bg-[#f7f4f2] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isSuccess ? "Payment Successful" : "Payment Failed"}
        </h1>
        <p className="mt-3 text-gray-600">
          {isSuccess
            ? "Your PayU payment was received. You can track the order from your Orders page."
            : "Your PayU payment could not be completed. The order is saved and marked as payment failed in your Orders page."}
        </p>
        {!isSuccess && reason && (
          <p className="mt-4 text-sm text-red-600 break-words">{reason}</p>
        )}
        {orderNumber && (
          <p className="mt-4 text-sm text-gray-500">Order: {orderNumber}</p>
        )}
        {!isSuccess && payuStatus && (
          <p className="mt-2 text-sm text-gray-500">PayU Status: {payuStatus}</p>
        )}
        {!isSuccess && unmappedStatus && (
          <p className="mt-1 text-sm text-gray-500">Gateway Status: {unmappedStatus}</p>
        )}
        {isSuccess && isFinishing && (
          <p className="mt-6 text-sm text-orange-600">Redirecting you shortly...</p>
        )}
        {!isSuccess && (
          <div className="mt-6">
            <Link
              href="/orders"
              className="inline-flex items-center justify-center rounded-lg bg-red-500 px-5 py-2.5 text-white hover:bg-red-600"
            >
              Go To Orders
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PayUStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f4f2] flex items-center justify-center px-4">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-sm text-gray-600">Loading payment status...</p>
          </div>
        </div>
      }
    >
      <PayUStatusContent />
    </Suspense>
  );
}

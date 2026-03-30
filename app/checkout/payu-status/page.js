"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function PayUStatusPage() {
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
    const finalizeSuccess = async () => {
      if (!isSuccess) {
        setIsFinishing(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const guestCartId = localStorage.getItem("guestCartId");

        await fetch("/api/cart", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : guestCartId
              ? { guestCartId }
              : {}),
          },
          body: JSON.stringify({ clearAll: true }),
        });
      } catch (error) {
        console.error("Failed to clear cart after PayU payment:", error);
      } finally {
        localStorage.removeItem("checkoutData");
        localStorage.removeItem("buyNowData");
        localStorage.removeItem("appliedCoupon");
        sessionStorage.removeItem("guestCheckoutVerification");
        updateCartCount(0);
        setIsFinishing(false);

        const hasToken = Boolean(localStorage.getItem("token"));
        setTimeout(() => {
          router.replace(hasToken ? "/orders" : "/thank-you");
        }, 1800);
      }
    };

    finalizeSuccess();
  }, [isSuccess, router, updateCartCount]);

  return (
    <div className="min-h-screen bg-[#f7f4f2] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isSuccess ? "Payment Successful" : "Payment Failed"}
        </h1>
        <p className="mt-3 text-gray-600">
          {isSuccess
            ? "Your PayU payment was received and your order is being finalized."
            : "Your PayU payment could not be completed. You can try checkout again."}
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
              href="/checkout"
              className="inline-flex items-center justify-center rounded-lg bg-red-500 px-5 py-2.5 text-white hover:bg-red-600"
            >
              Return to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

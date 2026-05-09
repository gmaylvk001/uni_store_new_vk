"use client";
import { useState, useEffect } from "react";

import CheckoutComponent from "@/components/checkout/checkout";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Checkout</h1>
      <CheckoutComponent /> {/* Use the Home component here */}
    </div>
  );
}

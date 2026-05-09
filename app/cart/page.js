"use client";
import { useState, useEffect } from "react";

import CartComponent from "@/components/cart";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Shopping Cart</h1>
      <CartComponent /> 
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";

import ShippingComponent from "@/components/shipping/shipping";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Shipping Information</h1>
      <ShippingComponent /> 
    </div>
  );
}

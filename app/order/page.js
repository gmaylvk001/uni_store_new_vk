"use client";
import { useState, useEffect } from "react";

import OrderComponent from "@/components/order/order";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Order Details</h1>
      <OrderComponent /> {/* Use the OrderComponent here */}
    </div>
  );
}

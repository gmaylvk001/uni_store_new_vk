"use client";
import { useState, useEffect } from "react";

import ReturnCancellationComponent from "@/components/return-and-cancellation/return-and-cancellation";

export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Return and Cancellation Policy</h1>
      <ReturnCancellationComponent /> 
    </div>
  );
}

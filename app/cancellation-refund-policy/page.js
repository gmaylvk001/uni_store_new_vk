"use client";
import { useState, useEffect } from "react";

import CancellationrefundComponent from "@/components/cancellationrefund/cancellationrefund";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Cancellation and Refund Policy</h1>
      <CancellationrefundComponent /> {/* Use the Home component here */}
    </div>
  );
}

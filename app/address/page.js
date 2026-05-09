"use client";
import { useState, useEffect } from "react";

import AddressComponent from "@/components/address/address";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Manage Addresses</h1>
      <AddressComponent /> {/* Use the ProfileComponent here */}
    </div>
  );
}

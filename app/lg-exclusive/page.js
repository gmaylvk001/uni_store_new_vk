"use client";
import { useState, useEffect } from "react";

import LocationComponent from "@/components/lg-exclusive/location";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">LG Exclusive Products</h1>
      <LocationComponent /> {/* Use the ProfileComponent here */}
    </div>
  );
}

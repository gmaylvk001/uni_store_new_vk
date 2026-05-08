"use client";
import { useState, useEffect } from "react";

import AboutusComponent from "@/components/aboutus/aboutus";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">About Unilet Store</h1>
      <AboutusComponent /> {/* Use the Home component here */}
    </div>
  );
}

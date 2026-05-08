"use client";
import { useState, useEffect } from "react";

import PrivacyComponent from "@/components/privacy/privacy";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Privacy Policy</h1>
      <PrivacyComponent /> 
    </div>
  );
}

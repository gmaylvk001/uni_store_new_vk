"use client";
import { useState, useEffect } from "react";

import ContactComponent from "@/components/contact/contact";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Contact Us</h1>
      <ContactComponent /> {/* Use the Home component here */}
    </div>
  );
}

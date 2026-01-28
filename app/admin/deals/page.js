"use client";
import { useState, useEffect } from "react";

import DealsComponent from "../../../app/admin/components/deals/deals";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      
      <DealsComponent /> {/* Use the deals component here */}
    </div>
  );
}

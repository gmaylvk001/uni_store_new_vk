"use client";
import { useState, useEffect } from "react";

import JobsComponent from "@/components/jobs/jobs";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Careers at Uni Store</h1>
      <JobsComponent /> {/* Use the Home component here */}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";

import FeedbackComponent from "@/components/feedback/feedback";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Send Feedback</h1>
      <FeedbackComponent /> {/* Use the Home component here */}
    </div>
  );
}

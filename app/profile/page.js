"use client";
import { useState, useEffect } from "react";

import ProfileComponent from "@/components/profile/profile";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">My Profile</h1>
      <ProfileComponent /> {/* Use the ProfileComponent here */}
    </div>
  );
}

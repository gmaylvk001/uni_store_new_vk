"use client";
import { useState, useEffect } from "react";

import Wishlistpage from "@/components/wishlistpage";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">My Wishlist</h1>
      <Wishlistpage /> 
    </div>
  );
}

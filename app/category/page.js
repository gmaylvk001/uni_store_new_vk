"use client";
import { useState, useEffect } from "react";

import CategoryComponent from "@/components/category/category";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Product Categories</h1>
      <CategoryComponent /> {/* Use the category component here */}
    </div>
  );
}
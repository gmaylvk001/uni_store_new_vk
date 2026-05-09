"use client";
import { useState, useEffect, use } from "react"; // Import 'use' from React
import CategoryComponent from "@/components/store/CategoryComponent";

export default function Dashboard({ params }) {
  // Unwrap the params promise using React.use()
  const resolvedParams = use(params);
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Store Details</h1>
      {/* Pass the resolved params to the CategoryComponent */}
      <CategoryComponent params={resolvedParams} />
    </div>
  );
} 
"use client";
import { useState, useEffect } from "react";

import BlogComponent from "@/components/blog/blog";


export default function Dashboard() {
  const [time, setTime] = useState(null);

  useEffect(() => {
    setTime(Date.now());
  }, []);

  return (
    <div>
      <h1 className="sr-only">Blog</h1>
      <BlogComponent /> 
    </div>
  );
}

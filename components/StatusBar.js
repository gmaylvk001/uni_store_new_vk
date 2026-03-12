"use client";

import { useEffect, useRef, useState } from "react";

function Counter({ end, duration = 2000 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const [shouldStart, setShouldStart] = useState(false);

  // Trigger animation when visible
  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Animate number
  useEffect(() => {
    if (!shouldStart) return;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * end));

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [shouldStart, end, duration]);

  return <span ref={ref}>{value.toLocaleString("en-IN")}</span>;
}

const StatusBar = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#005189] to-[#003468] py-3">
      <div
        className="
          max-w-7xl mx-auto px-4 text-white
          flex flex-col gap-4
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        {/* Stores */}
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <div className="text-2xl sm:text-3xl font-bold">
            <Counter end={50} />+
          </div>
          <p className="text-sm sm:text-lg">Stores</p>
        </div>
 
        <div className="hidden sm:block h-10 w-[1px] bg-white/30" />
 
        {/* Brands */}
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <div className="text-2xl sm:text-3xl font-bold">
            <Counter end={100} />+
          </div>
          <p className="text-sm sm:text-lg">Brands</p>
        </div>
 
        <div className="hidden sm:block h-10 w-[1px] bg-white/30" />
 
        {/* Happy Customers */}
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <div className="text-2xl sm:text-3xl font-bold">
            <Counter end={100000} />+
          </div>
          <p className="text-sm sm:text-lg">Happy Customers</p>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;

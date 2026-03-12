"use client";

import { useEffect, useRef, useState } from "react";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  BadgeCheck,
} from "lucide-react";
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

const DetailsPageStatusBar = () => {
  return (
    <div className="w-full py-4" style={{ background: "linear-gradient(90deg,rgba(137, 171, 196, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(135, 170, 195, 1) 100%)" }}>
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 px-4 text-center">
        
        {/* Free Delivery */}
        <div className="flex flex-col items-center gap-1">
          <Truck className="w-6 h-6 text-[#6256a5]" />
          <p className="text-[#ca0f0f] font-semibold text-sm">Free Delivery</p>
          <p className="text-[#32447f] text-xs">For all products</p>
        </div>

        {/* Protection Plan bg-[#3de3fe] */}
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="w-6 h-6 text-[#6256a5]" />
          <p className="text-[#ca0f0f] font-semibold text-sm">Protection Plan</p>
          <p className="text-[#32447f] text-xs">
            Accidental & liquid damage
          </p>
        </div>

        {/* 15 Days */}
        <div className="flex flex-col items-center gap-1">
          <RotateCcw className="w-6 h-6 text-[#6256a5]" />
          <p className="text-[#ca0f0f] font-semibold text-sm">15 Days</p>
          <p className="text-[#32447f] text-xs">Free returns</p>
        </div>

        {/* Payment */}
        <div className="flex flex-col items-center gap-1">
          <CreditCard className="w-6 h-6 text-[#6256a5]" />
          <p className="text-[#ca0f0f] font-semibold text-sm">Payment</p>
          <p className="text-[#32447f] text-xs">Secure system</p>
        </div>

        {/* Only Best */}
        <div className="flex flex-col items-center gap-1">
          <BadgeCheck className="w-6 h-6 text-[#6256a5]" />
          <p className="text-[#ca0f0f] font-semibold text-sm">Only Best</p>
          <p className="text-[#32447f] text-xs">Verified Quality</p>
        </div>

      </div>
    </div>
  );
};

export default DetailsPageStatusBar;

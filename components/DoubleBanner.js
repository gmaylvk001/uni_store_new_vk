"use client";
import React from "react";
import Link from "next/link";

const DoubleBanner = () => {
  const banners = [
    {
      id: 1,
      img: "uploads/aboutus/Apple-banner.jpeg",
      link: "/category/mobiles-accessories/mobile-phones/iphone",
      alt: "New iPhone Launch",
    },
    {
      id: 2,
      img: "uploads/aboutus/GodrejAc.png", 
      link: "/category/home-appliances/air-conditioner",
      alt: "Godrej AC Sale",
    },
  ];

  return (
    <section className="px-4 md:px-8 py-4 w-full">
      <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        {banners.map((banner) => (
          <Link 
            href={banner.link} 
            key={banner.id} 
            className="block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            
            <div className="relative w-full h-[100px] sm:h-[120px] md:h-[140px] lg:h-[180px]">
              <img
                src={banner.img}
                alt={banner.alt}
                className="w-full h-full object-fill object-center"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DoubleBanner;
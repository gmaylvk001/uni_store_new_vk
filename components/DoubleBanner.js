"use client";
import React from "react";
import Link from "next/link";

const DoubleBanner = () => {
  const banners = [
    {
      id: 1,
      img: "uploads/aboutus/SamsungTV.png",
      link: "/category/tv-entertainment",
      alt: "TV Sale Hot Offers",
    },
    {
      id: 2,
      img: "uploads/aboutus/GodrejAc.png",
      link: "/category/home-appliances/air-conditioner",
      alt: "Godrej AC Sale",
    },
    {
      id: 3,
      img: "uploads/aboutus/Apple-banner.jpeg",
      link: "/category/mobiles-accessories/mobile-phones/iphone",
      alt: "New iPhone Launch",
    },
  ];

  return (
    <section className="px-4 md:px-8 py-4 w-full">
      <div className="max-w-screen mx-auto flex flex-col md:flex-row gap-3 lg:gap-4">

        {/* Left - Large Image */}
        <Link
          href={banners[0].link}
          className="block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow md:w-1/2"
        >
          <div className="relative w-full h-[200px] sm:h-[260px] md:h-[320px] lg:h-[350px]">
            <img
              src={banners[0].img}
              alt={banners[0].alt}
              className="w-full h-full object-fill object-center"
            />
          </div>
        </Link>

        {/* Right - Two Stacked Images */}
        <div className="flex flex-row md:flex-col gap-3 lg:gap-4 md:w-1/2">
          {[banners[1], banners[2]].map((banner) => (
            <Link
              href={banner.link}
              key={banner.id}
              className="block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow flex-1"
            >
              <div className="relative w-full h-[100px] sm:h-[125px] md:h-[154px] lg:h-[166px]">
                <img
                  src={banner.img}
                  alt={banner.alt}
                  className="w-full h-full object-fill object-center"
                />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default DoubleBanner;
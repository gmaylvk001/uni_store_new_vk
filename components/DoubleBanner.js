"use client";
import React from "react";
import Link from "next/link";

const DoubleBanner = () => {
  const banners = [
    {
      id: 1,
      img: "uploads/aboutus/Fridge-bannerr.jpeg",
      link: "/category/home-appliances/refrigerator",
      alt: "Fridge Sale Hot Offers",
    },
    {
      id: 2,
      img: "uploads/aboutus/Apple-banner-square.jpeg",
      link: "/category/mobiles-accessories/mobile-phones/iphone",
      alt: "New iPhone Launch",
    },
    {
      id: 3,
      img: "uploads/aboutus/Ac-Banner-Square.png",
      link: "/category/home-appliances/air-conditioner",
      alt: "Godrej AC Sale",
    },
  ];

  return (
    <section className="px-4 md:px-8 py-4 w-full">
      {/* Changed items-center to items-stretch so the left side matches the right side's height */}
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-3 lg:gap-4 items-stretch">
        
        <Link
          href={banners[0].link}
          className="block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow md:w-3/5"
        >
          <div className="relative w-full h-full h-[135px]">
            <img
              src={banners[0].img}
              alt={banners[0].alt}
              className="w-full h-full object-fill object-center"
            />
          </div>
        </Link>

        <div className="flex flex-row gap-3 lg:gap-4 md:w-2/5">
          {[banners[1], banners[2]].map((banner) => (
            <Link
              href={banner.link}
              key={banner.id}
              className="block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow flex-1"
            >
              <div className="relative w-full aspect-square">
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
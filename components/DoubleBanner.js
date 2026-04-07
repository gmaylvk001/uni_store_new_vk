"use client";
import React from "react";
import Link from "next/link";

const DoubleBanner = () => {
  const banners = [
    {
      id: 1,
      img: "uploads/aboutus/d-ref-banner2.png",
      link: "/category/home-appliances/refrigerator",
      alt: "Fridge Sale Hot Offers",
    },
    {
      id: 2,
      img: "uploads/aboutus/d-iphone.jpeg",
      link: "/category/mobiles-accessories/mobile-phones/iphone",
      alt: "New iPhone Launch",
    },
    {
      id: 3,
      img: "uploads/aboutus/d-ac-1.jpg",
      link: "/category/home-appliances/air-conditioner",
      alt: "Godrej AC Sale",
    },
  ];

  return (
    <section className="px-4 md:px-8 py-4 w-full">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-3 lg:gap-4 items-stretch">
        <Link
          href={banners[0].link}
          className="block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow md:w-1/2"
        >
          <div className="relative w-full h-[180px] sm:h-[220px] md:h-full">
            <img
              src={banners[0].img}
              alt={banners[0].alt}
              className="w-full h-full object-contain object-center"
            />
          </div>
        </Link>

        <div className="flex flex-row gap-3 lg:gap-4 md:w-1/2">
          {[banners[1], banners[2]].map((banner) => (
            <Link
              href={banner.link}
              key={banner.id}
              className="block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow flex-1"
            >
              <div className="relative w-full h-full sm:aspect-square">
                <img
                  src={banner.img}
                  alt={banner.alt}
                  className="w-full h-full object-cover object-center"
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

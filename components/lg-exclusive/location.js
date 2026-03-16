'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function LocationPage() {

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStores() {
      try {
        const res = await fetch("/api/lg-store/get");
        const data = await res.json();

        if (data.success) {
          setStores(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch stores", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, []);

  if (loading) return <p>Loading stores...</p>;

  if (!stores || stores.length === 0) {
    return <p>No stores found.</p>;
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-8">
      
      <div className="max-w-7xl mx-auto">
       {/* Desktop Banner */}
<div
  className="hidden md:flex w-full h-[380px] bg-cover bg-center items-center justify-center"
  style={{
    backgroundImage: "url('/uploads/banners/lg-store-banner.png')",
  }}
>
        <div className="bg-black/50 w-full h-full flex items-center justify-center">
            <h1 className="text-white text-5xl font-bold">
              LG Exclusive Store
            </h1>
          </div>
        </div>

        {/* Mobile Banner */}
        <div
          className="flex md:hidden w-full h-[200px] bg-cover bg-center items-center justify-center"
          style={{
            backgroundImage: "url('/uploads/banners/m-lg-store-banner.png')",
          }}
        >
          <div className="bg-black/50 w-full h-full flex items-center justify-center px-4 text-center">
            <h1 className="text-white text-2xl font-bold">
              LG Exclusive Store
            </h1>
          </div>
        </div>



        <h1 className="text-3xl font-bold text-customBlue mb-10">
          Our Stores
        </h1>

        {/* Store Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {stores.map((store) => (

            <div
              key={store._id}
              className="border border-blue-300 rounded-lg shadow-sm p-4 hover:shadow-md transition"
            >

              {/* Store Name */}
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {store.name}
              </h2>

              {/* Address */}
              <p className="text-sm text-gray-700">
                {store.address}
              </p>

              <p className="text-sm text-gray-700">
                {store.city}, {store.state} - {store.pincode}
              </p>

              {/* Contact */}
              {store.contact && (
                <p className="text-sm text-gray-700 mt-1">
                  📞 {store.contact}
                </p>
              )}

              {/* Email */}
              {store.email && (
                <a
                  href={`mailto:${store.email}`}
                  className="block text-blue-600 hover:underline text-sm mt-1"
                >
                  {store.email}
                </a>
              )}

              {/* Work Hours */}
              {store.work_hours && (
                <p className="text-sm text-gray-600 mt-1">
                  ⏰ {store.work_hours}
                </p>
              )}

              {/* Google Map */}
              {store.google_location && (
                <div className="mt-3">
                  <iframe
                    //src={store.google_location}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(store.address)}&output=embed`}
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    loading="lazy"
                  ></iframe>
                </div>
              )}

              {/* Visit Store */}
              <Link
                href={store.google_location ? store.google_location : "#"}
                className="mt-3 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition-colors"
              >
                Visit Store
              </Link>

            </div>

          ))}

        </div>

      </div>
    </div>
  );
}
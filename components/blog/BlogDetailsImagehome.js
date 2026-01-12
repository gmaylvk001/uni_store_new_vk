"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function BlogDetailsImageHomeComponent() {
  const [blogs, setBlogs] = useState([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  /* FETCH BLOGS */
  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch("/api/blogs/get");
      const json = await res.json();
      if (json.success) {
        setBlogs(json.data.filter((b) => b.status === "Active"));
      }
    };
    fetchBlogs();
  }, []);

  /* AUTO SLIDE */
  useEffect(() => {
    if (!blogs.length) return;

    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [blogs, current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % blogs.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + blogs.length) % blogs.length);
  };

  if (!blogs.length) return null;

  const blog = blogs[current];

  return (
    <div className="relative px-4 md:px-8 py-3">
  <div className="relative h-[400px] rounded-2xl overflow-hidden">

    {/* GRADIENT BACKGROUND */}
    <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-[#ff6e6e]"></div>

    {/* MAIN CONTENT */}
    <div className="relative z-10 h-full flex flex-col md:flex-row">

      {/* LEFT IMAGE */}
      {/* LEFT IMAGE CARD */}
      <div className="w-[45%] flex items-center justify-center pl-8">
        <img
          src={blog.image || "/default-blog.jpg"}
          alt={blog.blog_name}
          className="h-[85%] w-full object-cover rounded-2xl shadow-2xl"
        />
      </div>

      {/* RIGHT CONTENT */}
      <div className="md:w-1/2 w-full flex flex-col justify-center p-6 sm:p-10">
        <span className="text-orange-400 text-xs mb-3">
          {new Date(blog.createdAt).toLocaleDateString("en-GB")}
        </span>

        <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4">
          {blog.blog_name}
        </h2>

        <p className="text-gray-300 text-sm sm:text-base line-clamp-3">
          {blog.description}
        </p>

        <Link
          href={`/blog/${blog.blog_slug}`}
          className="mt-5 inline-block bg-orange-500 hover:bg-orange-600
                     text-white text-sm font-semibold px-5 py-2 rounded-md w-max"
        >
          Read More
        </Link>
      </div>
    </div>

    {/* LEFT ARROW */}
    <button
      onClick={prevSlide}
      className="absolute left-3 top-1/2 -translate-y-1/2
                 bg-white p-2 rounded-full shadow z-20"
    >
      ‹
    </button>

    {/* RIGHT ARROW */}
    <button
      onClick={nextSlide}
      className="absolute right-3 top-1/2 -translate-y-1/2
                 bg-white p-2 rounded-full shadow z-20"
    >
      ›
    </button>
  </div>
</div>

  );
}

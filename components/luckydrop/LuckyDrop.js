// components/Franchise.js
"use client";
import { useState, useEffect } from "react";
import { FaMapMarkerAlt,FaChalkboardTeacher,FaCheckCircle} from "react-icons/fa";
import Image from "next/image";
import { getUrlParams } from "@/utils/geturlparameters";
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function LuckyDrop() {

  const {
    utm_source,
    utm_campaign,
    Store: outletFromUrl,
    child_id: childIdFromUrl,
  } = getUrlParams();

  const router = useRouter();

  // ✅ child_id fallback
  const childID =
    childIdFromUrl && childIdFromUrl.trim() !== "" ? childIdFromUrl : "837";

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    Store: outletFromUrl || "",
    product: "",
    coupon_no: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const err = {};

    if (!formData.name.trim()) err.name = "Name is required";
    if (!formData.mobile.trim()) {
      err.mobile = "Mobile No is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      err.mobile = "Mobile number must be exactly 10 digits";
    }
    if (!formData.product.trim()) err.product = "Product is required";


    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");

    if (!validate()) return;

    setLoading(true);

    const data = {
      api_token: "GIvz2vJIT2S0sErTIDj7us0YR1bx7lqE",
      first_name: formData.name.trim(),
      mobile: formData.mobile.trim(),
      Store: formData.Store,
      product: formData.product.trim(),
      coupon_code: formData.coupon_no.trim(),
      child_id: childID,
      lead_source: utm_source,
      lead_campaign: utm_campaign,
    };

    console.log("formdata",data);

    try {
      const res = await fetch("https://adtarbo.eywamedia.com/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("API error");

      router.push("/thank-you");
    } catch (error) {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white text-white">
    {/* Hero Section */}
      <div className="min-h-screen bg-gradient-to-b from-[#77B6E7] to-[#5B3BB7] flex items-center justify-center p-6">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row gap-10 md:gap-20 items-center justify-center">
          {/* Left text section */}
          <div className="text-white max-w-lg md:max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Your Purchase Could Win <br /> You Amazing Gifts!
            </h1>
            <p className="mb-4 text-base md:text-lg">
              Unlock exclusive rewards by entering your purchase details below.
            </p>
            <p className="text-base md:text-lg">
              Every purchase from our store gives you a special chance to participate in LuckDrop  our customer only rewards program.
            </p>
          </div>

           <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg text-gray-900" id="leadform">
                {/* NAME */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* MOBILE */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile No
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    placeholder="Enter mobile number"
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      // ✅ Allow ONLY numbers
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, mobile: value });
                      setErrors({ ...errors, mobile: "" });
                    }}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.mobile
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                  )}
                </div>


                {/* OUTLET (FROM URL, DISABLED) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Outlet
                  </label>
                  <input
                    type="text"
                    value={formData.Store}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 cursor-not-allowed"
                  />
                </div>

                {/* PRODUCT */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product
                  </label>
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    placeholder="Enter Product name"
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.product
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {errors.product && (
                    <p className="text-red-500 text-xs mt-1">{errors.product}</p>
                  )}
                </div>

                {/* COUPON */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Coupon No 
                    </label>
                    <input
                      type="text"
                      name="coupon_no"
                      value={formData.coupon_no}
                      onChange={handleChange}
                      placeholder="Enter coupon number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>


                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "SUBMIT"}
                </button>

                {/* SUCCESS / ERROR */}
                {successMsg && (
                  <p
                    className={`mt-3 text-center font-semibold ${
                      successMsg.includes("success")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {successMsg}
                  </p>
                )}
            </form>
        </div>
      </div>
      {/* Rewards Section */}
      <section className="max-w-7xl mx-auto px-6 py-10" id="how-it-work">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4 text-black">
          A Simple Way to Win Exciting Rewards
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-sm md:text-base">
          LuckDrop is a customer reward program by <strong>Unilet Stores</strong>, created to thank you for shopping with us. After your purchase, you can enter the LuckyDrop and stand a chance to win premium gifts, vouchers, and exclusive surprises.
        </p>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20">
          {/* Image on left */}
          <div className="flex justify-center md:justify-center md:w-1/2">
            <img
              src="images/landing-page-luckydrop/about-section-landing-img.jpg"
              alt="Unilet LuckDrop"
              className="max-w-full h-auto"
              loading="lazy"
            />
          </div>

          {/* Text on right */}
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold mb-4 text-black">How It Works</h3>
            <p className="text-gray-700 mb-6 text-sm md:text-base leading-relaxed">
              Every time you purchase from Unilet Stores, you become eligible for the LuckyDrop rewards program. Just fill in your purchase details below and your entry will be added instantly.
            </p>

            <ul className="space-y-6">
              {[
                {
                  title: 'Safe & transparent draw',
                  description: 'Fair selection process with verified winners',
                },
                {
                  title: 'Exclusive gifts for customers',
                  description: 'Premium rewards only for our valued customers',
                },
                {
                  title: 'Takes less than 1 minute to enter',
                  description: 'Quick registration with minimal information',
                },
              ].map(({ title, description }, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="text-blue-500 mt-1">
                    <FaCheckCircle size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-black">{title}</p>
                    <p className="text-gray-600 text-sm">{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {/* How to Participate  section */}
      <section className="bg-[#EDEEEE]" id="how-to-participate">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="max-w-7xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            How to Participate
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to enter the LuckDrop draw and stand a
            chance to win amazing rewards.
          </p>

          {/* Cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl shadow-md px-6 py-10 flex flex-col items-center">
              <FaMapMarkerAlt className="text-blue-400 text-6xl mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                Shop at Unilet Stores
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                Purchase any product from any of our outlets.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl shadow-md px-6 py-10 flex flex-col items-center">
              <FaChalkboardTeacher className="text-blue-400 text-6xl mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                Enter Your Details
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                Fill in your name, phone number, product purchased, and store
                location.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl shadow-md px-6 py-10 flex flex-col items-center">
              <FaCheckCircle className="text-blue-400 text-6xl mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                You&apos;re In!
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                Your entry is successfully added to this month’s LuckyDrop draw.
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>
       {/* Rewards section */}
      <section className="bg-white" id="rewards">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Exciting Rewards Await You
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Every valid entry stands a chance to win one or more of these amazing
            rewards.
          </p>

          {/* Rewards Container */}
          <div className="mt-14 border-2 border-blue-400 rounded-2xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Item 1 */}
              <div className="flex flex-col items-start p-8 gap-4 border-l-0 sm:border-l sm:border-l-blue-400">
                <Image
                  src="/images/landing-page-luckydrop/giftbox.jpg"
                  alt="Premium Gift Hampers"
                  width={64}
                  height={64}
                  className="object-contain"
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  Premium Gift Hampers
                </h3>
                <p className="text-gray-600 text-sm">
                  Curated collections of premium products
                </p>
              </div>

              {/* item 2 */}
              <div className="flex flex-col items-start p-8 gap-4 border-l-0 sm:border-l sm:border-l-blue-400">
                <Image
                  src="/images/landing-page-luckydrop/voucher.jpg"
                  alt="Premium Gift Hampers"
                  width={64}
                  height={64}
                  className="object-contain"
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  Shopping Vouchers
                </h3>
                <p className="text-gray-600 text-sm">
                  Discounts on your next purchase
                </p>
              </div>

              {/* item 3 */}
              <div className="flex flex-col items-start p-8 gap-4 border-l-0 sm:border-l sm:border-l-blue-400">
                <Image
                  src="/images/landing-page-luckydrop/cashback.jpg"
                  alt="Premium Gift Hampers"
                  width={64}
                  height={64}
                  className="object-contain"
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  Cashback Rewards
                </h3>
                <p className="text-gray-600 text-sm">
                  Get money back on your purchases
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
       {/* Cta section */}
      <section className="w-full bg-gradient-to-b from-[#77B6E7] to-[#5B3BB7]">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Try Your Luck?
          </h2>

          {/* Subtitle */}
          <p className="mt-4 text-white/90 text-base md:text-lg max-w-2xl mx-auto">
            Submit your details and be a part of our exclusive customer rewards
            program.
          </p>

          {/* Button */}
          <div className="mt-8">
            <Link href="#leadform"  className="bg-white text-blue-500 font-semibold px-8 py-3 rounded-full shadow-md hover:bg-gray-100 transition">
              Join LuckDrop Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


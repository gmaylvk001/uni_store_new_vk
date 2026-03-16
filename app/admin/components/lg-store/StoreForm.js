"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StoreForm({ storeData }) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: storeData?.name || "",
    address: storeData?.address || "",
    state: storeData?.state || "",
    city: storeData?.city || "",
    pincode: storeData?.pincode || "",
    contact: storeData?.contact || "",
    email: storeData?.email || "",
    work_hours: storeData?.work_hours || "",
    google_location: storeData?.google_location || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = storeData
      ? "/api/lg-store/update"
      : "/api/lg-store/add";

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, id: storeData?._id }),
    });

    router.push("/admin/lg-store");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

    {/* Store Name */}
  <div>
    <label className="block text-sm font-medium mb-1">Store Name</label>
    <input
      type="text"
      name="name"
      placeholder="Store Name"
      value={form.name}
      onChange={handleChange}
      className="border p-2 w-full rounded"
      required
    />
  </div>

  {/* Address */}
  <div>
    <label className="block text-sm font-medium mb-1">Address</label>
    <textarea
      name="address"
      placeholder="Enter store address"
      value={form.address}
      onChange={handleChange}
      rows="3"
      className="border p-2 w-full rounded"
    />
  </div>

  {/* City State Pincode */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    <div>
      <label className="block text-sm font-medium mb-1">City</label>
      <input
        type="text"
        name="city"
        placeholder="City"
        value={form.city}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">State</label>
      <input
        type="text"
        name="state"
        placeholder="State"
        value={form.state}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Pincode</label>
      <input
        type="text"
        name="pincode"
        placeholder="Pincode"
        value={form.pincode}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
    </div>

  </div>

  {/* Contact Email Work Hours */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

    <div>
      <label className="block text-sm font-medium mb-1">Contact</label>
      <input
        type="text"
        name="contact"
        placeholder="Contact Number"
        value={form.contact}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Email</label>
      <input
        type="email"
        name="email"
        placeholder="Store Email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">Work Hours</label>
      <input
        type="text"
        name="work_hours"
        placeholder="9:00 AM - 9:00 PM"
        value={form.work_hours}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
    </div>

  </div>

  {/* Google Location */}
  <div>
    <label className="block text-sm font-medium mb-1">Google Location</label>
    <input
      type="text"
      name="google_location"
      placeholder="Paste Google Map URL"
      value={form.google_location}
      onChange={handleChange}
      className="border p-2 w-full rounded"
    />
  </div>

      <button className="bg-red-500 text-white px-4 py-2 rounded">
        {storeData ? "Update Store" : "Create Store"}
      </button>

    </form>
  );
}
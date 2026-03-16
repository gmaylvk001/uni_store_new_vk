"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StoreForm from "@/app/admin/components/lg-store/StoreForm.js";

export default function EditStore() {
  const { id } = useParams();
  const [store, setStore] = useState(null);

  useEffect(() => {
    fetch(`/api/lg-store/${id}`)
      .then((res) => res.json())
      .then((data) => setStore(data.data));
  }, [id]);
console.log("API response for store data:", store);
  if (!store) return <p>Loading...</p>;

  return (
    <div className="container mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Edit Store</h2>
      <StoreForm storeData={store} />
    </div>
  );
}
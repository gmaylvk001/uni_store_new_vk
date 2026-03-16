"use client";

import StoreForm from "@/app/admin/components/lg-store/StoreForm.js";

export default function CreateStore() {
  return (
    <div className="container mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Create Store</h2>
      <StoreForm />
    </div>
  );
}
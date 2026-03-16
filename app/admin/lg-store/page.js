"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function StoreList() {

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    const res = await fetch("/api/lg-store/get");
    const data = await res.json();
    setStores(data.data || []);
  };

  const deleteStore = async (id) => {
    if (!confirm("Delete this store?")) return;

    await fetch("/api/lg-store/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchStores();
  };

  /* SEARCH FILTER */
  const filteredStores = useMemo(() => {
    return stores.filter((store) =>
      store.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [stores, search]);

  /* PAGINATION */
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);

  const paginatedStores = filteredStores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto mt-6">

      {/* Header */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Stores</h2>

        <Link href="/admin/lg-store/create">
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            + Add New Store
          </button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by store name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-64"
        />
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Store Name</th>
            <th className="p-2 text-left">City</th>
            <th className="p-2 text-left">State</th>
            <th className="p-2 text-left">Pincode</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {paginatedStores.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No stores found
              </td>
            </tr>
          ) : (
            paginatedStores.map((store) => (
              <tr key={store._id} className="border-b">
                <td className="p-2">{store.name}</td>
                <td className="p-2">{store.city}</td>
                <td className="p-2">{store.state}</td>
                <td className="p-2">{store.pincode}</td>

                <td className="p-2 flex gap-3">
                  <Link href={`/admin/lg-store/edit/${store._id}`}>
                    <FaEdit className="text-blue-600 cursor-pointer" />
                  </Link>

                  <FaTrash
                    className="text-red-600 cursor-pointer"
                    onClick={() => deleteStore(store._id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">

        <p className="text-sm text-gray-600">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, filteredStores.length)} of{" "}
          {filteredStores.length} entries
        </p>

        <div className="flex gap-2">

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="px-3 py-1 border rounded bg-gray-100">
            {currentPage} / {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      </div>

    </div>
  );
}
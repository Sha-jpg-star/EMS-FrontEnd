"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/components/sidebaradmin";
import Navbar from "@/app/components/navbar";
export default function AdminLeaves() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- LOAD LEAVES ----------------
  useEffect(() => {
    loadLeaves();
  }, []);

  const loadLeaves = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/leaves");

      if (!res.ok) {
        throw new Error("Failed to fetch leaves");
      }

      const data = await res.json();

      console.log("LEAVES DATA:", data); // debug

      setLeaves(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error loading leaves:", err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UPDATE STATUS ----------------
  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`http://localhost:5000/api/leaves/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      // refresh after update
      loadLeaves();
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  // ---------------- UI ----------------
  return (
  <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
       <Sidebar />
       <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
         <Navbar />
                 <div className="flex-1 overflow-y-auto bg-slate-950 p-8">

      <h1 className="text-3xl font-bold mb-6">Admin Leave Panel</h1>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-400">Loading leaves...</p>
      )}

      {/* EMPTY STATE */}
      {!loading && leaves.length === 0 && (
        <p className="text-gray-400">No leave requests found</p>
      )}

      {/* LIST */}
      <div className="grid gap-4">

        {leaves.map((l: any) => (
          <div
            key={l._id}
            className="bg-slate-900 border border-slate-700 p-5 rounded-2xl shadow-lg"
          >

            {/* TOP INFO */}
            <div className="flex justify-between items-center">

              <div>
                <p className="font-bold text-lg">{l.name}</p>
                <p className="text-sm text-gray-400">{l.empNo}</p>
                <p className="text-sm text-gray-300">
                  {l.leaveType} | {l.fromDate} → {l.toDate}
                </p>
              </div>

              {/* STATUS */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  l.status === "Approved"
                    ? "bg-green-600"
                    : l.status === "Rejected"
                    ? "bg-red-600"
                    : "bg-yellow-600"
                }`}
              >
                {l.status}
              </span>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">

              <button
                onClick={() => updateStatus(l._id, "Approved")}
                className="bg-green-600 hover:bg-green-500 px-4 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(l._id, "Rejected")}
                className="bg-red-600 hover:bg-red-500 px-4 py-1 rounded"
              >
                Reject
              </button>

            </div>

          </div>
        ))}

      </div>
    </div></div></div>
  );
}
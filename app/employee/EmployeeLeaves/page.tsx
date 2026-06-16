"use client";

import { useEffect, useState } from "react";
import socket from "@/services/socket";
import Sidebar from "@/app/components/sidebaremp";
import Navbar from "@/app/components/navbaremp";

export default function EmployeeLeaves() {
  const [form, setForm] = useState({
    empNo: "",
    name: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");

    if (user?.email) {
      fetch(`http://localhost:5000/api/employee/by-email/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setForm((prev) => ({
            ...prev,
            empNo: data.empNo || "",
            name: data.name || "",
          }));

          loadLeaves(data.empNo);

          // socket join
          socket.emit("join", data.empNo);
        });
    }
  }, []);

  const loadLeaves = async (empNo: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/leaves/emp/${empNo}`);
      const data = await res.json();
      setLeaves(data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const applyLeave = async () => {
    try {
      await fetch("http://localhost:5000/api/leaves/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      alert("Leave Applied Successfully!");

      loadLeaves(form.empNo);

      setForm((prev) => ({
        ...prev,
        leaveType: "",
        fromDate: "",
        toDate: "",
        reason: "",
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">

          {/* HEADER */}
          <h1 className="text-3xl font-bold mb-6">
             My Leave Dashboard
          </h1>

          {/* FORM CARD */}
          <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">

            <h2 className="text-2xl font-bold mb-6">
              Apply Leave
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              {/* EMP NO */}
              <input
                disabled
                value={form.empNo}
                className="bg-slate-800 p-3 rounded-xl"
              />

              {/* NAME */}
              <input
                disabled
                value={form.name}
                className="bg-slate-800 p-3 rounded-xl"
              />

              {/* LEAVE TYPE */}
              <select
                value={form.leaveType}
                onChange={(e) =>
                  setForm({ ...form, leaveType: e.target.value })
                }
                className="md:col-span-2 bg-slate-800 p-3 rounded-xl"
              >
                <option value="">Select Leave Type</option>
                <option value="Annual">Annual Leave</option>
                <option value="Medical">Medical Leave</option>
                <option value="Casual">Casual Leave</option>
              </select>

              {/* FROM */}
              <input
                type="date"
                value={form.fromDate}
                onChange={(e) =>
                  setForm({ ...form, fromDate: e.target.value })
                }
                className="bg-slate-800 p-3 rounded-xl"
              />

              {/* TO */}
              <input
                type="date"
                value={form.toDate}
                onChange={(e) =>
                  setForm({ ...form, toDate: e.target.value })
                }
                className="bg-slate-800 p-3 rounded-xl"
              />

              {/* REASON */}
              <textarea
                placeholder="Reason"
                value={form.reason}
                onChange={(e) =>
                  setForm({ ...form, reason: e.target.value })
                }
                className="md:col-span-2 bg-slate-800 p-3 rounded-xl h-32"
              />
            </div>

            <button
              onClick={applyLeave}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-500 transition p-3 rounded-xl font-bold"
            >
              Apply Leave
            </button>
          </div>

          {/* HISTORY */}
          <div className="max-w-4xl mx-auto mt-10">

            <h2 className="text-2xl font-bold mb-5">
               Leave History
            </h2>

            <div className="space-y-4">

              {leaves.map((l: any) => (
                <div
                  key={l._id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center hover:bg-white/10 transition"
                >
                  <div>
                    <h3 className="font-bold text-lg">
                      {l.leaveType}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {l.fromDate} → {l.toDate}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      {l.reason}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full font-bold text-sm ${
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
              ))}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
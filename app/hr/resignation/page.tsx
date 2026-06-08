"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebarhr";
import Navbar from "@/app/components/navbarhr";

export default function ResignationPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  
  const BACKEND_URL = "http://localhost:5000/api/employees";
  const DEPARTMENTS = ["All", "Security", "Cleaning", "Academic", "Non-Academic"];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(BACKEND_URL);
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResign = async (id: string) => {
    if (!confirm("Are you sure you want to resign this employee?")) return;

    try {
      const emp = employees.find((e) => e._id === id);
      const res = await fetch(`${BACKEND_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...emp, status: "Inactive" }),
      });

      if (res.ok) {
        setEmployees((prev) => prev.map((e) => (e._id === id ? { ...e, status: "Inactive" } : e)));
        alert("Employee status updated to Inactive.");
      }
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const filteredEmployees = employees.filter(
    (emp) => selectedDept === "All" || emp.department === selectedDept
  );

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Resignation Management</h1>
            <p className="text-gray-400">Manage employee departures and status updates.</p>
          </header>

          {/* Department Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDept === dept 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full text-left text-black">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-gray-600 uppercase text-xs tracking-wider">
                  <th className="p-4">Emp No</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="p-10 text-center">Loading...</td></tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-medium">{emp.empNo}</td>
                      <td className="p-4">{emp.name}</td>
                      <td className="p-4">{emp.department}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {emp.status === "Active" ? (
                          <button 
                            onClick={() => handleResign(emp._id)}
                            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 shadow-sm transition"
                          >
                            Resign
                          </button>
                        ) : (
                          <span className="text-gray-400 font-medium px-4 py-2 border border-gray-200 rounded-lg bg-gray-50">
                            Not Available
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
"use client";

import Sidebar from "@/app/components/sidebaradmin";
import Navbar from "@/app/components/navbar";
import React, { useState, useEffect } from "react";


interface Employee {
  _id: string;
  empNo: string;
  name: string;
  nic: string;
  phone: string;
  email: string;
  role: string;
  password?: string;
  department: "Security" | "Cleaning" | "Academic" | "Non-Academic";
  status: "Active" | "Inactive";
}

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
const [password, setPassword] = useState("");

  // Form States
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState<Employee | null>(null);
    // ඔබේ අනෙක් useState පවතින තැනට මෙය එක් කරන්න
const [role, setRole] = useState("OIC");

  // Form Input States
  const [empNo, setEmpNo] = useState("");
  const [name, setName] = useState("");
  const [nic, setNic] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const departmentStructure: Record<string, string[]> = {
  "Security": ["OIC", "JSO", "LSO"],
  "Cleaning": ["Supervisor", "Cleaner"],
  "Non-Academic": ["Admin Officer", "Office Assistant"],
  "Academic": ["Lecturer", "Assistant Lecturer"],
};
  const [department, setDepartment] =
    useState<Employee["department"]>("Security");
  const [status, setStatus] =
    useState<Employee["status"]>("Active");

  const BACKEND_URL = "http://localhost:5000/api/employees";

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const res = await fetch(BACKEND_URL);

      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchEmployees();
  }, []);

 
 // openAddModal එකට මෙය එක් කරන්න
const openAddModal = () => {
  setEditingEmployee(null);
  setEmpNo("");
  setName("");
  setNic("");
  setPhone("");
  setEmail("");
  setPassword("");
  setDepartment("Security");
  setRole("OIC"); // මෙය අනිවාර්යයි
  setStatus("Active");
  setIsModalOpen(true);
};

// openEditModal එකට මෙය එක් කරන්න
const openEditModal = (employee: Employee) => {
  setEditingEmployee(employee);
  setEmpNo(employee.empNo);
  setName(employee.name);
  setNic(employee.nic);
  setPhone(employee.phone);
  setEmail(employee.email);
  setPassword("");
  setDepartment(employee.department);
  setRole(employee.role || "OIC"); // Employee ගේ role එක පෙන්වන්න
  setStatus(employee.status);
  setIsModalOpen(true);
};

  // Save Employee
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
  !empNo ||
  !name ||
  !nic ||
  !phone ||
  !email ||
  (!editingEmployee && !password)
) {
  return alert("Please fill all fields");
}

    const employeeData = {
  empNo,
  name,
  nic,
  phone,
  email,
  password,
  department,
  role,
  status,
};

    try {
      // UPDATE
      if (editingEmployee) {
        const res = await fetch(
          `${BACKEND_URL}/${editingEmployee._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(employeeData),
          }
        );

        if (res.ok) {
          const updated = await res.json();

          setEmployees(
            employees.map((emp) =>
              emp._id === editingEmployee._id ? updated : emp
            )
          );

          setIsModalOpen(false);
        } else {
          const errData = await res.json();
          alert(errData.message || "Update failed");
        }
      }

      // ADD NEW
      else {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employeeData),
        });

        if (res.ok) {
          const newEmp = await res.json();

          setEmployees([newEmp, ...employees]);

          setIsModalOpen(false);
        } else {
          const errData = await res.json();
          alert(errData.message || "Failed to save employee");
        }
      }
    } catch (err) {
      console.error("API Error:", err);
      alert("Cannot connect to backend server!");
    }
  };

  // Delete Employee
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        const res = await fetch(`${BACKEND_URL}/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setEmployees(
            employees.filter((emp) => emp._id !== id)
          );
        } else {
          alert("Failed to delete employee");
        }
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  // Filter Employees
  const filteredEmployees =
    selectedDept === "All"
      ? employees
      : employees.filter(
          (emp) => emp.department === selectedDept
        );

  if (!isClient) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-6 lg:p-10 text-black">

          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-gray-200 mb-8">
              
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Employee Directory
                </h1>

                <p className="text-sm text-gray-400 mt-1">
                  Connected Live to MongoDB Cloud Database.
                </p>
              </div>

              <button
                onClick={openAddModal}
                className="mt-4 md:mt-0 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg shadow transition-colors"
              >
                + Add New Employee
              </button>
            </div>

            {/* Department Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                "All",
                "Security",
                "Cleaning",
                "Academic",
                "Non-Academic",
              ].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDept === dept
                      ? "bg-blue-900 text-white shadow"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

              <div className="w-full overflow-x-auto">

                <table className="w-full text-left border-collapse min-w-[900px]">

                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                      <th className="py-4 px-6">Emp No</th>
                      <th className="py-4 px-6">Name & Contact</th>
                      <th className="py-4 px-6">NIC Number</th>
                      <th className="py-4 px-6">Department</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-gray-400"
                        >
                          Loading data from MongoDB...
                        </td>
                      </tr>
                    ) : filteredEmployees.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-gray-400"
                        >
                          No employees found.
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees.map((emp) => (
                        <tr
                          key={emp._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6 font-medium text-gray-900">
                            {emp.empNo}
                          </td>

                          <td className="py-4 px-6">
                            <div className="font-medium text-gray-900">
                              {emp.name}
                            </div>

                            <div className="text-xs text-gray-500">
                              {emp.email}
                            </div>

                            <div className="text-xs text-gray-400">
                              {emp.phone}
                            </div>
                          </td>

                          <td className="py-4 px-6 text-gray-600 font-mono">
                            {emp.nic}
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                emp.department === "Security"
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : emp.department === "Cleaning"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : emp.department === "Academic"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}
                            >
                              {emp.department}
                            </span>
                          </td>

                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                                emp.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  emp.status === "Active"
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}
                              ></span>

                              {emp.status}
                            </span>
                          </td>

                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => openEditModal(emp)}
                              className="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                            >
                              Edit
                            </button>

                            <span className="text-gray-300">|</span>

                            <button
                              onClick={() =>
                                handleDelete(emp._id)
                              }
                              className="text-red-600 hover:text-red-900 font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                </table>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden border border-gray-100">

            {/* Modal Header */}
            <div className="bg-blue-900 px-6 py-4 text-black flex justify-between items-center">

              <h3 className="font-semibold text-lg">
                {editingEmployee
                  ? "Edit Employee Details"
                  : "Register New Employee"}
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-black hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSave}
              className="p-6 text-black space-y-4 overflow-y-auto max-h-[75vh]"
            >

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Staff Number
                  </label>

                  <input
                    type="text"
                    value={empNo}
                    onChange={(e) =>
                      setEmpNo(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    placeholder="e.g. 2032"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    NIC Number
                  </label>

                  <input
                    type="text"
                    value={nic}
                    onChange={(e) =>
                      setNic(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    placeholder="e.g. 1995..."
                    required
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="e.g. Mr. Premarathne"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    placeholder="e.g. 0712345678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    placeholder="e.g. name@company.com"
                    required
                  />
                </div>
               
               <div>
  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
    Password
  </label>

  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
    placeholder={
      editingEmployee
        ? "Leave blank to keep current password"
        : "Enter password"
    }
  />
</div>

              </div>

              {/* 1. Department Select එක */}
<div>
  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Department</label>
  <select
    value={department}
    onChange={(e) => {
      const selectedDept = e.target.value as keyof typeof departmentStructure;
      setDepartment(selectedDept);
      // දෙපාර්තමේන්තුව මාරු වූ වහාම, ඒ දෙපාර්තමේන්තුවේ මුල්ම role එක ස්වයංක්‍රීයව තෝරන්න
      setRole(departmentStructure[selectedDept][0]); 
    }}
    className="w-full border rounded-lg px-3 py-2"
  >
    {Object.keys(departmentStructure).map((dept) => (
      <option key={dept} value={dept}>{dept}</option>
    ))}
  </select>
</div>

{/* 2. Role Select එක (මෙය department එක මත පදනම් වේ) */}
<div>
  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Role</label>
  <select
    value={role}
    onChange={(e) => setRole(e.target.value)}
    className="w-full border rounded-lg px-3 py-2"
  >
    {departmentStructure[department].map((r) => (
      <option key={r} value={r}>{r}</option>
    ))}
  </select>
</div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Status
                </label>

                <div className="flex gap-4 mt-1">

                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={status === "Active"}
                      onChange={() => setStatus("Active")}
                    />
                    Active
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={status === "Inactive"}
                      onChange={() => setStatus("Inactive")}
                    />
                    Inactive
                  </label>

                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-sm font-medium shadow transition-colors"
                >
                  {editingEmployee
                    ? "Update Details"
                    : "Save Employee"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
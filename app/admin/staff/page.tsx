"use client";
import Sidebar from "../../components/sidebaradmin";
import Navbar from "@/app/components/navbar";
import React, { useState, useEffect } from "react";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("hr");

  const fetchStaff = async () => {
    const res = await fetch("http://localhost:5000/api/staff");
    const data = await res.json();
    setStaff(data);
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:5000/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    setName(""); setEmail(""); setPassword("");
    fetchStaff();
  };

  const deleteStaff = async (id: string) => {
    if (confirm("Are you sure?")) {
      await fetch(`http://localhost:5000/api/staff/${id}`, { method: "DELETE" });
      fetchStaff();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-8">
          <h1 className="text-2xl font-bold mb-6">Staff Management</h1>
          
          <form onSubmit={handleAddStaff} className="bg-gray-800 p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <input className="p-2 bg-gray-700 rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="p-2 bg-gray-700 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="p-2 bg-gray-700 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <select className="p-2 bg-gray-700 rounded" onChange={(e) => setRole(e.target.value)}>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
            <button className="col-span-full bg-blue-600 py-2 rounded font-bold">Add Staff</button>
          </form>

          <table className="w-full text-left bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Actions</th></tr></thead>
            <tbody>
              {staff.map((s: any) => (
                <tr key={s._id} className="border-t border-gray-700">
                  <td className="p-4">{s.name}</td>
                  <td className="p-4">{s.email}</td>
                  <td className="p-4 uppercase">{s.role}</td>
                  <td className="p-4"><button onClick={() => deleteStaff(s._id)} className="text-red-500">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
    </div>
  );
}
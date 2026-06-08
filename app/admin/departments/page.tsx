"use client";

import Sidebar from "../../components/sidebaradmin";
import Navbar from "@/app/components/navbar";
import { useEffect, useState } from "react";
import API from "@/services/api";
import { Building2, Plus, Trash2 } from "lucide-react";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    basicSalary: "",
    otRatePerHour: ""
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/departments");
      setDepartments(res.data);
    } catch (err) {
  console.error("Error fetching departments:", err);
} finally { 
  setLoading(false);
}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/departments", formData);
      alert("Department added successfully!");
      setFormData({ name: "", grade: "", basicSalary: "", otRatePerHour: "" });
      fetchDepartments();
    } catch (err) {
      alert("Error adding department.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this department?")) {
      try {
        await API.delete(`/admin/departments/delete/${id}`);
        fetchDepartments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <div className="p-6 md:p-8 overflow-y-auto max-w-6xl w-full mx-auto">
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide text-white">Departments & Grades</h1>
              <p className="text-xs text-slate-500 mt-0.5">Manage organization branches and structure base salary.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 h-fit shadow-xl">
              <h2 className="text-sm font-semibold mb-4 text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Plus size={16} className="text-blue-400" /> Add New Grade
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Department Name</label>
                  <input
                    type="text"
                    required
                    placeholder="ex:academic/Non-academic"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Grade / Rank</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Senior, Manager"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Basic Salary (LKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="75000"
                    value={formData.basicSalary}
                    onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">OT Rate Per Hour (LKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="500"
                    value={formData.otRatePerHour}
                    onChange={(e) => setFormData({ ...formData, otRatePerHour: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition-all shadow-md">
                  Save Setup
                </button>
              </form>
            </div>

            <div className="lg:col-span-2">
              {loading ? (
                <p className="text-slate-400 text-sm">Loading tracks...</p>
              ) : departments.length === 0 ? (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-sm">No grades set.</div>
              ) : (
                <div className="overflow-hidden bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
                  <table className="w-full text-left text-sm text-slate-300 border-collapse">
                    <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-4">Dept</th>
                        <th className="p-4">Grade</th>
                        <th className="p-4">Basic</th>
                        <th className="p-4">OT / Hr</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {departments.map((d) => (
                        <tr key={d._id} className="hover:bg-slate-800/20 transition-all">
                          <td className="p-4 font-semibold text-white text-xs uppercase">{d.name}</td>
                          <td className="p-4 text-slate-400">{d.grade}</td>
                          <td className="p-4 text-blue-400 font-medium">Rs. {d.basicSalary?.toLocaleString()}</td>
                          <td className="p-4 text-emerald-400 font-medium">Rs. {d.otRatePerHour?.toLocaleString()}</td>
                          <td className="p-4 text-center">
                            <button onClick={() => handleDelete(d._id)} className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/30">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
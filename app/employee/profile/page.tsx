"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebaremp";
import Navbar from "@/app/components/navbaremp";
import { User, Mail, Phone, Building, Hash, Lock, CreditCard, Save } from "lucide-react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    empNo: "",
    nic: "",
    phone: "",
    email: "",
    department: "",
    role: "",
    status: "",
  });
  const [newPassword, setNewPassword] = useState("");

 useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user && user.email) {
      fetch(`http://localhost:5000/api/employee/by-email/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched Data:", data); // මෙතනින් බලන්න role එක එනවද කියලා
          setFormData(data);
        })
        .catch((err) => console.error("Error loading profile:", err));
    }
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/employee/update/${formData.empNo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: newPassword,
        }),
      });

      if (res.ok) {
        alert("Profile updated successfully! Please log in again.");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        alert("Update failed!");
      }
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-4xl mx-auto mt-10">
          <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <User className="text-blue-500" /> My Personal Profile
          </h1>

          <form className="space-y-6">
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase">Full Name</label>
              <div className="relative mt-2">
                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-white" />
                <div className="absolute left-4 top-3.5 text-slate-500"><User size={16}/></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Staff Number</label>
                <div className="relative mt-2"><input disabled value={formData.empNo} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-slate-500" /><div className="absolute left-4 top-3.5 text-slate-500"><Hash size={16}/></div></div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">NIC Number</label>
                <div className="relative mt-2"><input disabled value={formData.nic} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-slate-500" /><div className="absolute left-4 top-3.5 text-slate-500"><CreditCard size={16}/></div></div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Phone Number</label>
                <div className="relative mt-2"><input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-white" /><div className="absolute left-4 top-3.5 text-slate-500"><Phone size={16}/></div></div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Department</label>
                <div className="relative mt-2"><input disabled value={formData.department} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-slate-500" /><div className="absolute left-4 top-3.5 text-slate-500"><Building size={16}/></div></div>
              </div>
            </div>
            <div>
  <label className="text-xs text-slate-400 font-semibold uppercase">Role</label>
  <div className="relative mt-2">
    <input 
      disabled 
      value={formData.role} 
      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-slate-500" 
    />
    <div className="absolute left-4 top-3.5 text-slate-500">
      <User size={16}/> 
    </div>
  </div>
</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Email Address</label>
                <div className="relative mt-2"><input name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-white" /><div className="absolute left-4 top-3.5 text-slate-500"><Mail size={16}/></div></div>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">New Password</label>
                <div className="relative mt-2"><input type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-white" /><div className="absolute left-4 top-3.5 text-slate-500"><Lock size={16}/></div></div>
              </div>
            </div>

            <button type="button" onClick={handleUpdate} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2">
              <Save size={18}/> Update Profile Details
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/sidebaremp";
import Navbar  from "@/app/components/navbaremp";
import { User, Mail, Phone, Building, Hash, Lock, CreditCard, Save, KeyRound } from "lucide-react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "", empNo: "", nic: "", phone: "",
    email: "", department: "", role: "", status: "",
  });

  // Password section වෙනමම state
  const [showPwSection, setShowPwSection] = useState(false);
  const [oldPassword,   setOldPassword]   = useState("");
  const [newPassword,   setNewPassword]   = useState("");
  const [pwError,       setPwError]       = useState("");
  const [loading,       setLoading]       = useState(false);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (user?.email) {
      fetch(`http://localhost:5000/api/employee/by-email/${user.email}`)
        .then(r => r.json())
        .then(data => setFormData(data))
        .catch(err => console.error("Error loading profile:", err));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setPwError("");

    // Password change කරනවා නම් old password ඕනා
    if (showPwSection && newPassword && !oldPassword) {
      setPwError("Please enter your current password.");
      return;
    }

    setLoading(true);
    try {
      const body = {
        name:  formData.name,
        phone: formData.phone,
        ...(showPwSection && newPassword && {
          oldPassword,
          newPassword,
        }),
      };

      const res = await fetch(
        `http://localhost:5000/api/employee/update/${formData.empNo}`,
        {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert(
          newPassword
            ? "Profile updated! Please log in again with your new password."
            : "Profile updated successfully!"
        );
        if (newPassword) {
          sessionStorage.removeItem("user");
          window.location.href = "/login";
        }
        // Password fields clear කරනවා
        setOldPassword("");
        setNewPassword("");
        setShowPwSection(false);
      } else {
        // Backend error (wrong old password etc.)
        setPwError(data.message || "Update failed!");
      }
    } catch (err) {
      console.error("Error updating:", err);
      setPwError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-y-auto bg-slate-950 p-8">
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-4xl mx-auto mt-10">
            <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <User className="text-blue-500" /> My Personal Profile
            </h1>

            <div className="space-y-6">
              {/* Full Name — editable */}
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Full Name</label>
                <div className="relative mt-2">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-white"
                  />
                  <div className="absolute left-4 top-3.5 text-slate-500"><User size={16}/></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Staff No — disabled */}
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Staff Number</label>
                  <div className="relative mt-2">
                    <input disabled value={formData.empNo} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-slate-500"/>
                    <div className="absolute left-4 top-3.5 text-slate-500"><Hash size={16}/></div>
                  </div>
                </div>

                {/* NIC — disabled */}
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">NIC Number</label>
                  <div className="relative mt-2">
                    <input disabled value={formData.nic} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-slate-500"/>
                    <div className="absolute left-4 top-3.5 text-slate-500"><CreditCard size={16}/></div>
                  </div>
                </div>

                {/* Phone — editable */}
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Phone Number</label>
                  <div className="relative mt-2">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-white"
                    />
                    <div className="absolute left-4 top-3.5 text-slate-500"><Phone size={16}/></div>
                  </div>
                </div>

                {/* Department — disabled */}
                <div>
                  <label className="text-xs text-slate-400 font-semibold uppercase">Department</label>
                  <div className="relative mt-2">
                    <input disabled value={formData.department} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-slate-500"/>
                    <div className="absolute left-4 top-3.5 text-slate-500"><Building size={16}/></div>
                  </div>
                </div>
              </div>

              {/* Role — disabled */}
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Role</label>
                <div className="relative mt-2">
                  <input disabled value={formData.role} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-slate-500"/>
                  <div className="absolute left-4 top-3.5 text-slate-500"><User size={16}/></div>
                </div>
              </div>

              {/* Email — disabled (cannot change) */}
              <div>
                <label className="text-xs text-slate-400 font-semibold uppercase">Email Address</label>
                <div className="relative mt-2">
                  <input disabled value={formData.email} className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-slate-500"/>
                  <div className="absolute left-4 top-3.5 text-slate-500"><Mail size={16}/></div>
                </div>
                <p className="text-xs text-slate-600 mt-1">Email address cannot be changed.</p>
              </div>

              {/* Password Section — toggle */}
              <div className="border border-slate-800 rounded-xl p-4">
                <button
                  type="button"
                  onClick={() => { setShowPwSection(p => !p); setPwError(""); setOldPassword(""); setNewPassword(""); }}
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold transition"
                >
                  <KeyRound size={15}/>
                  {showPwSection ? "Cancel password change" : "Change password"}
                </button>

                {showPwSection && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="text-xs text-slate-400 font-semibold uppercase">Current Password</label>
                      <div className="relative mt-2">
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={e => { setOldPassword(e.target.value); setPwError(""); }}
                          placeholder="Enter current password"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-white placeholder-slate-600"
                        />
                        <div className="absolute left-4 top-3.5 text-slate-500"><Lock size={16}/></div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-semibold uppercase">New Password</label>
                      <div className="relative mt-2">
                        <input
                          type="password"
                          value={newPassword}
                          onChange={e => { setNewPassword(e.target.value); setPwError(""); }}
                          placeholder="Enter new password"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 py-3 text-white placeholder-slate-600"
                        />
                        <div className="absolute left-4 top-3.5 text-slate-500"><Lock size={16}/></div>
                      </div>
                    </div>
                  </div>
                )}

                {pwError && (
                  <p className="text-red-400 text-sm mt-3">{pwError}</p>
                )}
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2"
              >
                <Save size={18}/>
                {loading ? "Saving..." : "Update Profile Details"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
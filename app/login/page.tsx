"use client";

import Link from "next/link";
import { useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

 
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // API.post භාවිතා කරන නිසා එය දත්ත යවයි
    const res = await API.post("/auth/login", form);

    const user = res.data.user;

    sessionStorage.setItem("token", res.data.token);
   sessionStorage.setItem("user", JSON.stringify(user));

    alert("Login Successful");

    if (user.role === "admin") {
      router.push("/admin/dashboard");
    } else if (user.role === "hr") {
      router.push("/hr/dashboard");
    } else {
      router.push("/employee/dashboard");
    }

  } catch (err) {
    // Backend එකෙන් එන error code එක මෙතැනින් පරීක්ෂා කළ හැක
    if (err.response && err.response.status === 403) {
      alert("Account is Not Available: Access Denied.");
    } else {
      alert(err.response?.data?.message || "Login Failed");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Login to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

       
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      

      </div>

    </div>
  );
}

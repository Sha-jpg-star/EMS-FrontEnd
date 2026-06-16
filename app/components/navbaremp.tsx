"use client";

import { Bell, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/services/api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // 1. User දත්ත ලබාගැනීම
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.role !== "employee") {
        router.push("/login");
        return;
      }
      setUser(parsed);
      // 2. User ලොග් වී සිටී නම් පමණක් Notifications ලබාගන්න
      fetchNotifications();
    } else {
      router.push("/login");
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      // Backend එකෙන් නොකියවූ (unread) notifications පමණක් ලබාගන්න
      const res = await API.get("/employee/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log("Error fetching notifications:", err);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="w-full h-16 bg-blue-900 flex justify-between items-center px-8 text-white shadow-md">
      {/* Welcome Message */}
      <div className="flex items-center gap-2">
        <User size={18} />
        <h2 className="text-lg font-semibold">
          Welcome, {user?.name || "Employee"}
        </h2>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-5">
        

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white hover:text-amber-200 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
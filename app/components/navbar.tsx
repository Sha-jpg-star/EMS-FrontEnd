"use client";

import { Bell, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [openProfile, setOpenProfile] = useState(false);

  // ===============================
  // LOAD USER + NOTIFICATIONS LOOP
  // ===============================
  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // ===============================
  // FETCH NOTIFICATIONS
  // ===============================
  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications/admin");

      if (!res.ok) return;

      const data = await res.json();

      // always array safe
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Notification error:", err);
    }
  };

  // ===============================
  // UNREAD COUNT
  // ===============================
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ===============================
  // LOGOUT
  // ===============================
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="w-full h-16 bg-gradient-to-r from-blue-900 to-blue-700 flex justify-between items-center px-8 text-white relative">

      {/* LEFT TITLE */}
      <h2 className="text-lg font-semibold">
        Welcome, {user?.name || "Admin"}
      </h2>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5">

        {/* ===================== BELL ===================== */}
        <div className="relative">

          <button
            onClick={() => router.push("/admin/Leaves")}
            className="relative bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <Bell size={20} />
          </button>

          {/* UNREAD BADGE */}
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full animate-pulse">
              {unreadCount}
            </div>
          )}
        </div>

        {/* ===================== PROFILE ===================== */}
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="w-10 h-10 rounded-full bg-white text-blue-900 font-bold flex items-center justify-center"
        >
          {user?.name?.charAt(0).toUpperCase() || "A"}
        </button>

        {/* DROPDOWN */}
        {openProfile && (
          <div className="absolute top-14 right-8 bg-white text-black w-56 rounded-xl shadow-xl p-4 z-50">

            <h3 className="font-bold">{user?.name}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>

            <hr className="my-3" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-800"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
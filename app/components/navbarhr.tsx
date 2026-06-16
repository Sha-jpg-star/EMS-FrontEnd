"use client";

import { Bell, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/notifications/admin"
      );

      if (!res.ok) return;

      const data = await res.json();

      console.log("API RESPONSE:", data);

    
      const list = Array.isArray(data)
        ? data
        : data?.notifications || [];

      setNotifications(list);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };


  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000); // safe interval

    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    console.log("NOTIFICATIONS STATE:", notifications);
  }, [notifications]);


  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => n.isRead === false).length
    : 0;

  console.log("UNREAD COUNT:", unreadCount);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="w-full h-16 bg-gradient-to-r from-blue-900 to-blue-700 flex justify-between items-center px-8 text-white relative">

      {/* LEFT */}
      <h2 className="text-lg font-semibold">
        Welcome, {user?.name || "Admin"}
      </h2>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        {/*BELL */}
        <div className="relative">
          <button
            onClick={() => router.push("/hr/Leaves")}
            className="relative bg-white/10 hover:bg-white/20 p-2 rounded-full"
          >
            <Bell size={22} />
          </button>

          {/* BADGE */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 z-50 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-red-600 text-white text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>

       
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-white text-blue-900 font-bold flex items-center justify-center"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </button>

          {open && (
            <div className="absolute top-14 right-0 bg-white text-black w-56 rounded-xl shadow-xl p-4 z-50">
              <h3 className="font-bold">{user?.name}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>

              <button
                onClick={handleLogout}
                className="mt-3 flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
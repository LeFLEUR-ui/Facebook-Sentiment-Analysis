import React, { useState, useRef, useEffect } from "react";
import { LogOut, Bell, Search, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({ searchTerm, setSearchTerm }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const notificationsRef = useRef(null);
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: "New comment on your post", time: "2 mins ago" },
    { id: 2, title: "Page reached 1000 likes!", time: "1 hr ago" },
    { id: 3, title: "New follower: John Doe", time: "3 hrs ago" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const email = localStorage.getItem("user_email");
    if (email) setUserEmail(email);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_email");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 md:px-6 py-3 flex justify-between items-center">

      <div className="flex items-center gap-4">
        <h1 className="text-lg md:text-xl font-bold text-gray-900">
          Facebook Sentiment <span className="text-indigo-600">Analysis</span>
        </h1>
        <span className="hidden md:inline text-xs text-gray-500 uppercase tracking-wide">
          Welcome back, {userEmail || "User"}
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-3 relative">

        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400 top-1/2 -translate-y-1/2" size={16} />
          <input
            type="text"
            placeholder="Search analytics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-1.5 bg-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition w-64"
          />
        </div>

        <div className="relative" ref={notificationsRef}>
          <button
            className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex flex-col gap-2 animate-slideDown z-50">
              <h4 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-2">
                Notifications
              </h4>
              {notifications.map((note) => (
                <div
                  key={note.id}
                  className="p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setShowNotifications(false)}
                >
                  <p className="text-sm text-gray-800">{note.title}</p>
                  <span className="text-xs text-gray-400">{note.time}</span>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-gray-400 text-sm text-center">No new notifications</p>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          <LogOut size={16} className="text-gray-400" />
        </button>
      </div>

      <div className="lg:hidden flex items-center">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white shadow-lg rounded-xl border border-gray-200 p-4 flex flex-col gap-3 animate-slideDown z-50">

          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search analytics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-1.5 bg-gray-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition w-full"
            />
          </div>

          <button
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition w-full"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} className="flex-shrink-0" />
            <span>Notifications</span>
            <span className="ml-auto w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {showNotifications && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 flex flex-col gap-2">
              {notifications.map((note) => (
                <div
                  key={note.id}
                  className="p-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => setShowNotifications(false)}
                >
                  <p className="text-sm text-gray-800">{note.title}</p>
                  <span className="text-xs text-gray-400">{note.time}</span>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-gray-400 text-sm text-center">No new notifications</p>
              )}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition w-full"
          >
            <LogOut size={16} className="text-gray-400 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
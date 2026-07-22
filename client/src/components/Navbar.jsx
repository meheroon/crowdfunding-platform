"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { FiBell, FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import axiosSecure from "@/utils/axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        axiosSecure.get("/notifications"),
        axiosSecure.get("/notifications/unread-count"),
      ]);
      setNotifications(notifRes.data.slice(0, 10));
      setUnreadCount(countRes.data.count);
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              FundSpark
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/explore"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Explore Campaigns
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <FiBell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50">
                      <div className="p-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">
                          Notifications
                        </h3>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No notifications yet
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <Link
                            key={notif._id}
                            href={notif.actionRoute || "/dashboard"}
                            className="block p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowNotifications(false)}
                          >
                            <p className="text-sm text-gray-700">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notif.time).toLocaleDateString()}
                            </p>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Credits */}
                <div className="bg-gradient-to-r from-primary-50 to-accent-50 px-3 py-1 rounded-full border border-primary-200">
                  <span className="text-sm font-semibold text-primary-700">
                    {user.credits} Credits
                  </span>
                </div>

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  {user.photo_url && (
                    <img
                      src={user.photo_url}
                      alt={user.display_name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-200"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {user.display_name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-accent-600 transition-all shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </>
            )}

            <a
              href="https://github.com/yourusername/crowdfunding-client"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600"
          >
            {mobileMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/explore"
                className="text-gray-700 hover:text-primary-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore Campaigns
              </Link>

              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-gray-700 hover:text-primary-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="px-3 py-2">
                    <span className="text-sm font-semibold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                      {user.credits} Credits
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-2">
                    {user.photo_url && (
                      <img
                        src={user.photo_url}
                        alt={user.display_name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {user.display_name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-primary-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-5 py-2 rounded-lg font-medium text-center mx-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

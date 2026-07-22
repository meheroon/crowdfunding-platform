"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import {
  FiHome,
  FiSearch,
  FiCreditCard,
  FiPlus,
  FiList,
  FiDollarSign,
  FiUsers,
  FiFileText,
  FiShield,
  FiAlertTriangle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const DashboardSidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const supporterLinks = [
    { href: "/dashboard", icon: FiHome, label: "Home" },
    {
      href: "/dashboard/supporter/explore-campaigns",
      icon: FiSearch,
      label: "Explore Campaigns",
    },
    {
      href: "/dashboard/supporter/my-contributions",
      icon: FiList,
      label: "My Contributions",
    },
    {
      href: "/dashboard/supporter/purchase-credit",
      icon: FiCreditCard,
      label: "Purchase Credit",
    },
    {
      href: "/dashboard/supporter/payment-history",
      icon: FiDollarSign,
      label: "Payment History",
    },
  ];

  const creatorLinks = [
    { href: "/dashboard", icon: FiHome, label: "Home" },
    {
      href: "/dashboard/creator/add-campaign",
      icon: FiPlus,
      label: "Add New Campaign",
    },
    {
      href: "/dashboard/creator/my-campaigns",
      icon: FiList,
      label: "My Campaigns",
    },
    {
      href: "/dashboard/creator/withdrawals",
      icon: FiDollarSign,
      label: "Withdrawals",
    },
    {
      href: "/dashboard/creator/payment-history",
      icon: FiFileText,
      label: "Payment History",
    },
  ];

  const adminLinks = [
    { href: "/dashboard", icon: FiHome, label: "Home" },
    { href: "/dashboard/admin/manage-users", icon: FiUsers, label: "Manage Users" },
    {
      href: "/dashboard/admin/manage-campaigns",
      icon: FiList,
      label: "Manage Campaigns",
    },
    {
      href: "/dashboard/admin/campaign-approvals",
      icon: FiShield,
      label: "Campaign Approvals",
    },
    {
      href: "/dashboard/admin/withdrawal-requests",
      icon: FiDollarSign,
      label: "Withdrawal Requests",
    },
    { href: "/dashboard/admin/reports", icon: FiAlertTriangle, label: "Reports" },
  ];

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "creator"
      ? creatorLinks
      : supporterLinks;

  return (
    <aside
      className={`bg-white border-r border-gray-200 min-h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-100">
        {!collapsed && (
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              {user?.photo_url && (
                <img
                  src={user.photo_url}
                  alt={user.display_name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.display_name}
                </p>
                <p className="text-xs text-primary-600 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        )}
        {collapsed && user?.photo_url && (
          <div className="flex justify-center">
            <img
              src={user.photo_url}
              alt={user.display_name}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
            />
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-primary-600"
              }`}
              title={collapsed ? link.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium">{link.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="absolute bottom-4 left-0 right-0 px-3 hidden lg:block">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          {collapsed ? (
            <FiChevronRight className="w-5 h-5" />
          ) : (
            <FiChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;

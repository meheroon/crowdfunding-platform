"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import axiosSecure from "@/utils/axios";
import { FiUsers, FiTrendingUp, FiCreditCard, FiDollarSign } from "react-icons/fi";

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalSupporters: 0,
    totalCreators: 0,
    totalCredits: 0,
    totalPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, paymentsRes] = await Promise.all([
          axiosSecure.get("/users/admin-stats"),
          axiosSecure.get("/payments/total"),
        ]);
        setStats({
          totalSupporters: usersRes.data.totalSupporters,
          totalCreators: usersRes.data.totalCreators,
          totalCredits: usersRes.data.totalCredits,
          totalPayments: paymentsRes.data.total,
        });
      } catch (error) {
        console.error("Failed to fetch stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Supporters",
      value: stats.totalSupporters,
      icon: FiUsers,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Creators",
      value: stats.totalCreators,
      icon: FiTrendingUp,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Total Credits",
      value: stats.totalCredits,
      icon: FiCreditCard,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Total Payments ($)",
      value: stats.totalPayments,
      icon: FiDollarSign,
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {loading ? "..." : stat.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminHome;

"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/components/AuthProvider";
import axiosSecure from "@/utils/axios";
import { FiList, FiClock, FiDollarSign } from "react-icons/fi";

const SupporterHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalContributions: 0,
    pendingContributions: 0,
    totalAmountContributed: 0,
  });
  const [approvedContributions, setApprovedContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, contribsRes] = await Promise.all([
          axiosSecure.get("/contributions/stats"),
          axiosSecure.get("/contributions/my-contributions?limit=5"),
        ]);
        setStats(statsRes.data);
        setApprovedContributions(
          contribsRes.data.contributions.filter((c) => c.status === "approved")
        );
      } catch (error) {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.display_name}!
          </h1>
          <p className="text-gray-600">Here&apos;s your contribution overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiList className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalContributions}
                </p>
                <p className="text-sm text-gray-500">Total Contributions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FiClock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingContributions}
                </p>
                <p className="text-sm text-gray-500">Pending Contributions</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalAmountContributed}
                </p>
                <p className="text-sm text-gray-500">
                  Amount Contributed (Credits)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Approved Contributions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Approved Contributions
          </h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : approvedContributions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No approved contributions yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Campaign
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Creator
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {approvedContributions.map((contrib) => (
                    <tr
                      key={contrib._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-900">
                        {contrib.campaign_title}
                      </td>
                      <td className="py-3 px-4 text-primary-600 font-semibold">
                        {contrib.Contribution_amount} credits
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {contrib.creator_name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Approved
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupporterHome;

"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import axiosSecure from "@/utils/axios";

const MyContributions = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchContributions();
  }, [page]);

  const fetchContributions = async () => {
    try {
      const res = await axiosSecure.get(
        `/contributions/my-contributions?page=${page}&limit=10`
      );
      setContributions(res.data.contributions);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch contributions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Contributions</h1>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : contributions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No contributions yet</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
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
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contributions.map((contrib) => (
                      <tr
                        key={contrib._id}
                        className="border-b border-gray-50 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-gray-900 font-medium">
                          {contrib.campaign_title}
                        </td>
                        <td className="py-3 px-4 text-primary-600 font-semibold">
                          {contrib.Contribution_amount} credits
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {contrib.creator_name}
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm">
                          {new Date(
                            contrib.current_date
                          ).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={getStatusBadge(contrib.status)}>
                            {contrib.status.charAt(0).toUpperCase() +
                              contrib.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyContributions;

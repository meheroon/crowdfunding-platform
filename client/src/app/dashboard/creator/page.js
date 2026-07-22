"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/components/AuthProvider";
import axiosSecure from "@/utils/axios";
import toast from "react-hot-toast";
import { FiCheck, FiX, FiEye } from "react-icons/fi";

const CreatorHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalRaised: 0,
  });
  const [pendingContributions, setPendingContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campaignsRes, contribsRes] = await Promise.all([
        axiosSecure.get("/campaigns/creator/my-campaigns"),
        axiosSecure.get("/contributions/pending-contributions"),
      ]);

      const campaigns = campaignsRes.data;
      const activeCampaigns = campaigns.filter(
        (c) => new Date(c.deadline) > new Date() && c.status === "approved"
      );
      const totalRaised = campaigns.reduce(
        (sum, c) => sum + c.amount_raised,
        0
      );

      setStats({
        totalCampaigns: campaigns.length,
        activeCampaigns: activeCampaigns.length,
        totalRaised,
      });
      setPendingContributions(contribsRes.data);
    } catch (error) {
      console.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (contribId) => {
    try {
      await axiosSecure.put(`/contributions/approve/${contribId}`);
      toast.success("Contribution approved!");
      fetchData();
    } catch (error) {
      toast.error("Failed to approve contribution");
    }
  };

  const handleReject = async (contribId) => {
    try {
      await axiosSecure.put(`/contributions/reject/${contribId}`);
      toast.success("Contribution rejected and refunded!");
      fetchData();
    } catch (error) {
      toast.error("Failed to reject contribution");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.display_name}!
          </h1>
          <p className="text-gray-600">Here&apos;s your creator dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalCampaigns}
            </p>
            <p className="text-gray-500">Total Campaigns</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-3xl font-bold text-green-600">
              {stats.activeCampaigns}
            </p>
            <p className="text-gray-500">Active Campaigns</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-3xl font-bold text-primary-600">
              {stats.totalRaised}
            </p>
            <p className="text-gray-500">Total Raised (Credits)</p>
          </div>
        </div>

        {/* Pending Contributions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Contributions to Review
          </h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : pendingContributions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No pending contributions
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Supporter
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Campaign
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingContributions.map((contrib) => (
                    <tr
                      key={contrib._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-900">
                        {contrib.Supporter_name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {contrib.campaign_title}
                      </td>
                      <td className="py-3 px-4 text-primary-600 font-semibold">
                        {contrib.Contribution_amount} credits
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              setSelectedContribution(contrib)
                            }
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(contrib._id)}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(contrib._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Contribution Detail Modal */}
        {selectedContribution && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contribution Details
              </h3>
              <div className="space-y-3">
                <p>
                  <span className="font-medium">Supporter:</span>{" "}
                  {selectedContribution.Supporter_name}
                </p>
                <p>
                  <span className="font-medium">Campaign:</span>{" "}
                  {selectedContribution.campaign_title}
                </p>
                <p>
                  <span className="font-medium">Amount:</span>{" "}
                  {selectedContribution.Contribution_amount} credits
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(
                    selectedContribution.current_date
                  ).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    handleApprove(selectedContribution._id);
                    setSelectedContribution(null);
                  }}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedContribution._id);
                    setSelectedContribution(null);
                  }}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => setSelectedContribution(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreatorHome;

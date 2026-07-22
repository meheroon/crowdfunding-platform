"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import toast from "react-hot-toast";
import axiosSecure from "@/utils/axios";
import { FiTrash2 } from "react-icons/fi";

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axiosSecure.get("/campaigns/all");
      setCampaigns(res.data);
    } catch (error) {
      console.error("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (campaignId) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      await axiosSecure.delete(`/campaigns/${campaignId}`);
      toast.success("Campaign deleted successfully!");
      fetchCampaigns();
    } catch (error) {
      toast.error("Failed to delete campaign");
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Campaigns</h1>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Campaign
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Creator
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Goal
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Raised
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr
                      key={campaign._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {campaign.campaign_title}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {campaign.creator_name}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {campaign.funding_goal} credits
                      </td>
                      <td className="py-3 px-4 text-primary-600 font-semibold">
                        {campaign.amount_raised} credits
                      </td>
                      <td className="py-3 px-4">
                        <span className={getStatusBadge(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() +
                            campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleDelete(campaign._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
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

export default ManageCampaigns;

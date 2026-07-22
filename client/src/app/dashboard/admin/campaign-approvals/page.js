"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import toast from "react-hot-toast";
import axiosSecure from "@/utils/axios";
import { FiCheck, FiX } from "react-icons/fi";

const CampaignApprovals = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axiosSecure.get("/campaigns/pending");
      setCampaigns(res.data);
    } catch (error) {
      console.error("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (campaignId) => {
    try {
      await axiosSecure.put(`/campaigns/approve/${campaignId}`);
      toast.success("Campaign approved!");
      fetchCampaigns();
    } catch (error) {
      toast.error("Failed to approve campaign");
    }
  };

  const handleReject = async (campaignId) => {
    try {
      await axiosSecure.put(`/campaigns/reject/${campaignId}`);
      toast.success("Campaign rejected!");
      fetchCampaigns();
    } catch (error) {
      toast.error("Failed to reject campaign");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Campaign Approvals</h1>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No pending campaigns to review</p>
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
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Goal
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
                        {campaign.category}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {campaign.funding_goal} credits
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(campaign._id)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            <FiCheck className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(campaign._id)}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            <FiX className="w-4 h-4" />
                            <span>Reject</span>
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
      </div>
    </DashboardLayout>
  );
};

export default CampaignApprovals;

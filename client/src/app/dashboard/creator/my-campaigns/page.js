"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import toast from "react-hot-toast";
import axiosSecure from "@/utils/axios";
import { FiEdit2, FiTrash2, FiX } from "react-icons/fi";

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editData, setEditData] = useState({
    campaign_title: "",
    campaign_story: "",
    reward_info: "",
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axiosSecure.get("/campaigns/creator/my-campaigns");
      setCampaigns(res.data);
    } catch (error) {
      console.error("Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axiosSecure.put(`/campaigns/${editingCampaign._id}`, editData);
      toast.success("Campaign updated successfully!");
      setEditingCampaign(null);
      fetchCampaigns();
    } catch (error) {
      toast.error("Failed to update campaign");
    }
  };

  const handleDelete = async (campaignId) => {
    if (!confirm("Are you sure? This will delete the campaign and refund all approved contributions.")) {
      return;
    }

    try {
      await axiosSecure.delete(`/campaigns/${campaignId}`);
      toast.success("Campaign deleted and contributions refunded!");
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
        <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No campaigns created yet</p>
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
                      Goal
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Raised
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Deadline
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
                        {campaign.funding_goal} credits
                      </td>
                      <td className="py-3 px-4 text-primary-600 font-semibold">
                        {campaign.amount_raised} credits
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {new Date(campaign.deadline).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={getStatusBadge(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() +
                            campaign.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingCampaign(campaign);
                              setEditData({
                                campaign_title: campaign.campaign_title,
                                campaign_story: campaign.campaign_story,
                                reward_info: campaign.reward_info,
                              });
                            }}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(campaign._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
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

        {/* Edit Modal */}
        {editingCampaign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Edit Campaign
                </h3>
                <button
                  onClick={() => setEditingCampaign(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editData.campaign_title}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        campaign_title: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Story
                  </label>
                  <textarea
                    value={editData.campaign_story}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        campaign_story: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reward Info
                  </label>
                  <textarea
                    value={editData.reward_info}
                    onChange={(e) =>
                      setEditData({ ...editData, reward_info: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-600"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingCampaign(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyCampaigns;

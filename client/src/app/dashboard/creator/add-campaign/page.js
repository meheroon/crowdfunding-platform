"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import toast from "react-hot-toast";
import axiosSecure from "@/utils/axios";
import { useRouter } from "next/navigation";

const AddCampaign = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    campaign_title: "",
    campaign_story: "",
    category: "Technology",
    funding_goal: "",
    minimum_Contribution: "",
    deadline: "",
    reward_info: "",
    campaign_image_url: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosSecure.post("/campaigns", {
        ...formData,
        funding_goal: parseInt(formData.funding_goal),
        minimum_Contribution: parseInt(formData.minimum_Contribution),
      });
      toast.success("Campaign created successfully! Awaiting admin approval.");
      router.push("/dashboard/creator/my-campaigns");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Add New Campaign
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-gray-100 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Title
            </label>
            <input
              type="text"
              name="campaign_title"
              value={formData.campaign_title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Help us build a solar-powered water pump"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Story
            </label>
            <textarea
              name="campaign_story"
              value={formData.campaign_story}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              placeholder="Tell the story of your campaign..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                required
              >
                <option value="Technology">Technology</option>
                <option value="Art">Art</option>
                <option value="Community">Community</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Funding Goal (credits)
              </label>
              <input
                type="number"
                name="funding_goal"
                value={formData.funding_goal}
                onChange={handleChange}
                min="100"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="5000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Contribution (credits)
              </label>
              <input
                type="number"
                name="minimum_Contribution"
                value={formData.minimum_Contribution}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reward Information
            </label>
            <textarea
              name="reward_info"
              value={formData.reward_info}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              placeholder="What supporters receive for pledging..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Image URL
            </label>
            <input
              type="url"
              name="campaign_image_url"
              value={formData.campaign_image_url}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? "Creating Campaign..." : "Add Campaign"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddCampaign;

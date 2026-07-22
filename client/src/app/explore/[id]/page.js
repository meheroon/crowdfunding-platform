"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";
import axiosSecure from "@/utils/axios";
import { FiClock, FiUsers, FiTarget, FiAlertTriangle } from "react-icons/fi";

const CampaignDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contributionAmount, setContributionAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await axiosSecure.get(`/campaigns/${id}`);
        setCampaign(res.data);
      } catch (error) {
        toast.error("Campaign not found");
        router.push("/explore");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id, router]);

  const handleContribute = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to contribute");
      router.push("/login");
      return;
    }

    if (user.role !== "supporter") {
      toast.error("Only supporters can contribute to campaigns");
      return;
    }

    const amount = parseInt(contributionAmount);
    if (amount < campaign.minimum_Contribution) {
      toast.error(
        `Minimum contribution is ${campaign.minimum_Contribution} credits`
      );
      return;
    }

    if (amount > user.credits) {
      toast.error("Insufficient credits. Please purchase more credits.");
      return;
    }

    setSubmitting(true);

    try {
      await axiosSecure.post("/contributions", {
        campaign_id: campaign._id,
        campaign_title: campaign.campaign_title,
        Contribution_amount: amount,
        creator_name: campaign.creator_name,
        creator_email: campaign.creator_email,
      });
      toast.success("Contribution submitted successfully!");
      setContributionAmount("");
      // Refresh user credits
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Contribution failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.post("/reports", {
        campaign_id: campaign._id,
        campaign_title: campaign.campaign_title,
        reporter_name: user.display_name,
        reason: reportReason,
      });
      toast.success("Report submitted successfully");
      setShowReport(false);
      setReportReason("");
    } catch (error) {
      toast.error("Failed to submit report");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!campaign) return null;

  const progress = Math.min(
    (campaign.amount_raised / campaign.funding_goal) * 100,
    100
  );
  const daysLeft = Math.max(
    0,
    Math.ceil(
      (new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Image */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={campaign.campaign_image_url}
                alt={campaign.campaign_title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-primary-700 text-sm font-semibold px-4 py-2 rounded-full">
                  {campaign.category}
                </span>
              </div>
            </div>

            {/* Campaign Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {campaign.campaign_title}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <img
                  src={
                    campaign.creator_image ||
                    "https://randomuser.me/api/portraits/lego/1.jpg"
                  }
                  alt={campaign.creator_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {campaign.creator_name}
                  </p>
                  <p className="text-sm text-gray-500">Campaign Creator</p>
                </div>
              </div>

              <div className="prose max-w-none mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  About this Campaign
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {campaign.campaign_story}
                </p>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Rewards
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {campaign.reward_info}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-primary-600">
                  {campaign.amount_raised}
                </p>
                <p className="text-gray-500">
                  raised of {campaign.funding_goal} credits
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiUsers className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                  <p className="font-semibold text-gray-900">
                    {campaign.supporter_count}
                  </p>
                  <p className="text-xs text-gray-500">Supporters</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <FiClock className="w-5 h-5 text-accent-500 mx-auto mb-1" />
                  <p className="font-semibold text-gray-900">{daysLeft}</p>
                  <p className="text-xs text-gray-500">Days Left</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg mb-4">
                <div className="flex items-center space-x-2">
                  <FiTarget className="w-4 h-4 text-primary-600" />
                  <span className="text-sm text-primary-700">
                    Min. Contribution
                  </span>
                </div>
                <span className="font-semibold text-primary-700">
                  {campaign.minimum_Contribution} credits
                </span>
              </div>

              {/* Contribution Form */}
              {user?.role === "supporter" && daysLeft > 0 && (
                <form onSubmit={handleContribute} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contribution Amount (credits)
                    </label>
                    <input
                      type="number"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      min={campaign.minimum_Contribution}
                      max={user.credits}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder={`Min: ${campaign.minimum_Contribution}`}
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Your available credits: {user.credits}
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg disabled:opacity-50"
                  >
                    {submitting ? "Contributing..." : "Contribute Now"}
                  </button>
                </form>
              )}

              {!user && (
                <p className="text-center text-gray-500">
                  Please{" "}
                  <a href="/login" className="text-primary-600 font-semibold">
                    login
                  </a>{" "}
                  to contribute
                </p>
              )}
            </div>

            {/* Report Button */}
            {user && user.role === "supporter" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <button
                  onClick={() => setShowReport(!showReport)}
                  className="flex items-center space-x-2 text-red-500 hover:text-red-600 font-medium"
                >
                  <FiAlertTriangle className="w-5 h-5" />
                  <span>Report this Campaign</span>
                </button>

                {showReport && (
                  <form onSubmit={handleReport} className="mt-4 space-y-3">
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                      rows={3}
                      placeholder="Why are you reporting this campaign?"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      Submit Report
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;

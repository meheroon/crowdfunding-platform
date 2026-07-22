"use client";

import Link from "next/link";

const CampaignCard = ({ campaign }) => {
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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={campaign.campaign_image_url}
          alt={campaign.campaign_title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
            {campaign.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-accent-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
            {daysLeft} days left
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {campaign.campaign_title}
        </h3>
        <p className="text-gray-500 text-sm mb-3">
          by {campaign.creator_name}
        </p>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {campaign.campaign_story}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold text-primary-600">
              {campaign.amount_raised} credits
            </span>
            <span className="text-gray-500">
              {progress.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            of {campaign.funding_goal} credits goal
          </p>
        </div>

        <Link
          href={`/explore/${campaign._id}`}
          className="block text-center bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2.5 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default CampaignCard;

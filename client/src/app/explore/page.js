"use client";

import { useState, useEffect } from "react";
import CampaignCard from "@/components/CampaignCard";
import axiosSecure from "@/utils/axios";
import { FiSearch, FiFilter } from "react-icons/fi";

const Explore = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Technology",
    "Art",
    "Community",
    "Health",
    "Education",
    "Environment",
    "Business",
    "Other",
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axiosSecure.get("/campaigns/approved");
        setCampaigns(res.data);
        setFilteredCampaigns(res.data);
      } catch (error) {
        console.error("Failed to fetch campaigns");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    let results = campaigns;

    if (searchTerm) {
      results = results.filter(
        (c) =>
          c.campaign_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.creator_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      results = results.filter((c) => c.category === selectedCategory);
    }

    setFilteredCampaigns(results);
  }, [searchTerm, selectedCategory, campaigns]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore Campaigns
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover innovative projects and support the ones that inspire you
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white min-w-[200px]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No campaigns found matching your criteria
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-4">
              Showing {filteredCampaigns.length} campaigns
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;

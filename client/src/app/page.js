"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import CampaignCard from "@/components/CampaignCard";
import TestimonialSection from "@/components/TestimonialSection";
import HowItWorks from "@/components/HowItWorks";
import CategorySection from "@/components/CategorySection";
import StatsSection from "@/components/StatsSection";
import axiosSecure from "@/utils/axios";

const Home = () => {
  const [topCampaigns, setTopCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCampaigns = async () => {
      try {
        const res = await axiosSecure.get("/campaigns/top-funded");
        setTopCampaigns(res.data);
      } catch (error) {
        console.error("Failed to fetch top campaigns");
      } finally {
        setLoading(false);
      }
    };
    fetchTopCampaigns();
  }, []);

  const slides = [
    {
      title: "Bring Your Vision to Life",
      subtitle:
        "Join thousands of creators funding innovative projects through community support",
      bg: "from-primary-600 via-primary-700 to-accent-700",
      image:
        "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200",
    },
    {
      title: "Fund the Future Today",
      subtitle:
        "Discover groundbreaking campaigns and be part of something extraordinary",
      bg: "from-accent-600 via-accent-700 to-primary-700",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200",
    },
    {
      title: "Empower Creators Worldwide",
      subtitle:
        "Every contribution matters. Help turn ideas into reality and make a lasting impact",
      bg: "from-emerald-600 via-emerald-700 to-primary-700",
      image:
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200",
    },
  ];

  return (
    <div>
      {/* Hero Section with Slider */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-[600px] md:h-[700px]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className={`relative h-full bg-gradient-to-r ${slide.bg} flex items-center`}
              >
                {/* Background Image Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in-up stagger-1">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up stagger-2">
                      <Link
                        href="/explore"
                        className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl text-center"
                      >
                        Explore Campaigns
                      </Link>
                      <Link
                        href="/register"
                        className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all text-center"
                      >
                        Start a Campaign
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Top Funded Campaigns */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up">
              Top Funded Campaigns
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in-up stagger-1">
              Discover the campaigns that have captured the hearts and wallets of
              our community
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topCampaigns.map((campaign, index) => (
                <div
                  key={campaign._id}
                  className={`animate-fade-in-up stagger-${index + 1}`}
                >
                  <CampaignCard campaign={campaign} />
                </div>
              ))}
            </div>
          )}

          {topCampaigns.length > 0 && (
            <div className="text-center mt-10">
              <Link
                href="/explore"
                className="inline-block bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg hover:shadow-xl"
              >
                View All Campaigns
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Explore by Category */}
      <CategorySection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* Platform Impact Numbers */}
      <StatsSection />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join our community of creators and supporters. Whether you have an
            idea to share or want to support the next big thing, FundSpark is
            the place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-lg text-center"
            >
              Get Started Free
            </Link>
            <Link
              href="/explore"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all text-center"
            >
              Browse Campaigns
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

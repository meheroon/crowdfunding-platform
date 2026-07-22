"use client";

import Link from "next/link";
import {
  FiMonitor,
  FiHeart,
  FiUsers,
  FiActivity,
  FiBookOpen,
  FiGlobe,
} from "react-icons/fi";

const categories = [
  {
    icon: FiMonitor,
    name: "Technology",
    count: "150+",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FiHeart,
    name: "Health",
    count: "80+",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: FiUsers,
    name: "Community",
    count: "120+",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: FiActivity,
    name: "Art",
    count: "200+",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: FiBookOpen,
    name: "Education",
    count: "90+",
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: FiGlobe,
    name: "Environment",
    count: "70+",
    color: "from-teal-500 to-green-500",
  },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find campaigns that match your interests and passions
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={index}
                href={`/explore?category=${category.name}`}
                className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.count} projects</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

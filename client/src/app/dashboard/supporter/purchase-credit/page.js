"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";
import axiosSecure from "@/utils/axios";
import { FiCreditCard } from "react-icons/fi";

const packages = [
  { credits: 100, price: 10, label: "Starter" },
  { credits: 300, price: 25, label: "Popular" },
  { credits: 800, price: 60, label: "Premium" },
  { credits: 1500, price: 110, label: "Ultimate" },
];

const PurchaseCredit = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handlePurchase = async (pkg) => {
    setSelectedPackage(pkg);
    setLoading(true);

    try {
      await axiosSecure.post("/payments", {
        amount: pkg.price,
        credits_purchased: pkg.credits,
        package_name: pkg.label,
      });
      toast.success(`Successfully purchased ${pkg.credits} credits!`);
      await updateUser();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Credits</h1>
          <p className="text-gray-600">
            Your current balance:{" "}
            <span className="font-semibold text-primary-600">
              {user?.credits} credits
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.credits}
              className={`bg-white rounded-xl shadow-md p-6 border-2 transition-all hover:shadow-lg ${
                pkg.label === "Popular"
                  ? "border-primary-500 relative"
                  : "border-gray-100"
              }`}
            >
              {pkg.label === "Popular" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="text-center">
                <FiCreditCard className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {pkg.label}
                </h3>
                <p className="text-3xl font-bold text-primary-600 mb-1">
                  {pkg.credits}
                </p>
                <p className="text-sm text-gray-500 mb-4">credits</p>
                <p className="text-2xl font-bold text-gray-900 mb-4">
                  ${pkg.price}
                </p>
                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={loading && selectedPackage?.credits === pkg.credits}
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2.5 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all disabled:opacity-50"
                >
                  {loading && selectedPackage?.credits === pkg.credits
                    ? "Processing..."
                    : "Buy Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PurchaseCredit;

"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/components/AuthProvider";
import toast from "react-hot-toast";
import axiosSecure from "@/utils/axios";

const Withdrawals = () => {
  const { user, updateUser } = useAuth();
  const [totalRaised, setTotalRaised] = useState(0);
  const [creditsToWithdraw, setCreditsToWithdraw] = useState("");
  const [paymentSystem, setPaymentSystem] = useState("Stripe");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchRaised = async () => {
      try {
        const res = await axiosSecure.get("/campaigns/creator/my-campaigns");
        const raised = res.data.reduce((sum, c) => sum + c.amount_raised, 0);
        setTotalRaised(raised);
      } catch (error) {
        console.error("Failed to fetch raised amount");
      } finally {
        setFetching(false);
      }
    };
    fetchRaised();
  }, []);

  const withdrawalAmount = Math.floor((parseInt(creditsToWithdraw) || 0) / 20);
  const canWithdraw = parseInt(creditsToWithdraw) >= 200 && totalRaised >= parseInt(creditsToWithdraw);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosSecure.post("/withdrawals", {
        withdrawal_credit: parseInt(creditsToWithdraw),
        withdrawal_amount: withdrawalAmount,
        payment_system: paymentSystem,
        account_number: accountNumber,
      });
      toast.success("Withdrawal request submitted!");
      setCreditsToWithdraw("");
      setAccountNumber("");
      updateUser();
    } catch (error) {
      toast.error(error.response?.data?.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Withdrawals</h1>

        {/* Total Earnings */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Your Earnings
          </h2>
          {fetching ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-primary-600">
                  {totalRaised}
                </p>
                <p className="text-sm text-primary-700">
                  Raised Credits
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-600">
                  ${Math.floor(totalRaised / 20)}
                </p>
                <p className="text-sm text-green-700">
                  Withdrawal Amount ($)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Request Withdrawal
          </h2>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credits to Withdraw
              </label>
              <input
                type="number"
                value={creditsToWithdraw}
                onChange={(e) => setCreditsToWithdraw(e.target.value)}
                min="200"
                max={totalRaised}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Minimum 200 credits"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum: 200 credits ($10) | 20 credits = $1
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Withdrawal Amount ($)
              </label>
              <input
                type="text"
                value={`$${withdrawalAmount}`}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment System
              </label>
              <select
                value={paymentSystem}
                onChange={(e) => setPaymentSystem(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
              >
                <option value="Stripe">Stripe</option>
                <option value="Bkash">Bkash</option>
                <option value="Rocket">Rocket</option>
                <option value="Nagad">Nagad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Enter your account number"
                required
              />
            </div>

            {canWithdraw ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-3 rounded-lg font-semibold hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg disabled:opacity-50"
              >
                {loading ? "Processing..." : "Withdraw"}
              </button>
            ) : (
              <p className="text-center text-red-500 font-medium py-3">
                Insufficient credit
              </p>
            )}
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Withdrawals;

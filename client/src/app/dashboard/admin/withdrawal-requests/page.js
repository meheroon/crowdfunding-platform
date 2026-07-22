"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import toast from "react-hot-toast";
import axiosSecure from "@/utils/axios";
import { FiCheck } from "react-icons/fi";

const WithdrawalRequests = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await axiosSecure.get("/withdrawals/pending");
      setWithdrawals(res.data);
    } catch (error) {
      console.error("Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (withdrawalId) => {
    try {
      await axiosSecure.put(`/withdrawals/approve/${withdrawalId}`);
      toast.success("Withdrawal approved and processed!");
      fetchWithdrawals();
    } catch (error) {
      toast.error("Failed to process withdrawal");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Withdrawal Requests
        </h1>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No pending withdrawal requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Creator
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Credits
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Amount ($)
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Payment System
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Account
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((withdrawal) => (
                    <tr
                      key={withdrawal._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {withdrawal.creator_name}
                      </td>
                      <td className="py-3 px-4 text-primary-600 font-semibold">
                        {withdrawal.withdrawal_credit} credits
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        ${withdrawal.withdrawal_amount}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {withdrawal.payment_system}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {withdrawal.account_number}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {new Date(
                          withdrawal.withdraw_date
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleApprove(withdrawal._id)}
                          className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          <FiCheck className="w-4 h-4" />
                          <span>Payment Success</span>
                        </button>
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

export default WithdrawalRequests;

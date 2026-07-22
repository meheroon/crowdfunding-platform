"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import axiosSecure from "@/utils/axios";

const CreatorPaymentHistory = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const res = await axiosSecure.get("/withdrawals/my-withdrawals");
        setWithdrawals(res.data);
      } catch (error) {
        console.error("Failed to fetch withdrawals");
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawals();
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : withdrawals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No withdrawal history yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
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
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((withdrawal) => (
                    <tr
                      key={withdrawal._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-primary-600 font-semibold">
                        {withdrawal.withdrawal_credit} credits
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        ${withdrawal.withdrawal_amount}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {withdrawal.payment_system}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {new Date(
                          withdrawal.withdraw_date
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={getStatusBadge(withdrawal.status)}>
                          {withdrawal.status.charAt(0).toUpperCase() +
                            withdrawal.status.slice(1)}
                        </span>
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

export default CreatorPaymentHistory;

"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import toast from "react-hot-toast";
import axiosSecure from "@/utils/axios";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axiosSecure.get("/reports");
      setReports(res.data);
    } catch (error) {
      console.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId) => {
    try {
      await axiosSecure.put(`/reports/resolve/${reportId}`);
      toast.success("Report resolved and campaign deleted!");
      fetchReports();
    } catch (error) {
      toast.error("Failed to resolve report");
    }
  };

  const handleDismiss = async (reportId) => {
    try {
      await axiosSecure.put(`/reports/dismiss/${reportId}`);
      toast.success("Report dismissed!");
      fetchReports();
    } catch (error) {
      toast.error("Failed to dismiss report");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      resolved: "bg-green-100 text-green-700",
      dismissed: "bg-gray-100 text-gray-700",
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No reports yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Reporter
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Campaign
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Reason
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report._id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-900">
                        {report.reporter_name}
                      </td>
                      <td className="py-3 px-4 text-gray-900 font-medium">
                        {report.campaign_title}
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                        {report.reason}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {new Date(report.report_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={getStatusBadge(report.status)}>
                          {report.status.charAt(0).toUpperCase() +
                            report.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {report.status === "pending" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleResolve(report._id)}
                              className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                              Suspend Campaign
                            </button>
                            <button
                              onClick={() => handleDismiss(report._id)}
                              className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                              Dismiss
                            </button>
                          </div>
                        )}
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

export default Reports;

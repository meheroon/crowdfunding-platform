"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;

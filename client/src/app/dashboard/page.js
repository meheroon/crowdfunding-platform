"use client";

import { useAuth } from "@/components/AuthProvider";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.replace("/dashboard/admin");
      } else if (user.role === "creator") {
        router.replace("/dashboard/creator");
      } else {
        router.replace("/dashboard/supporter");
      }
    }
  }, [user, router]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

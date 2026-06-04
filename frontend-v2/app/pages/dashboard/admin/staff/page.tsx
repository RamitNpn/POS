"use client";

import AddStaffModal from "@/components/dashboard/admin/staff/AddStaffModal";
import StaffGrid from "@/components/dashboard/admin/staff/StaffGrid";
import StaffStats from "@/components/dashboard/admin/staff/StaffStats";
import StaffTabs from "@/components/dashboard/admin/staff/StaffTabs";

export default function StaffPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Staff Management</h1>
          <p className="text-zinc-400 text-sm mt-2">
            Manage employees, roles, attendance & performance
          </p>
        </div>
        <AddStaffModal />
      </div>

      <StaffStats />

      <StaffGrid />

      <StaffTabs />
    </div>
  );
}

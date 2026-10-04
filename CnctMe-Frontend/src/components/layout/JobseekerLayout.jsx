import { Outlet } from "react-router-dom";

import DashboardHeader from "../recruiterDashboard/DashboardHeader";
import DashboardSidebar from "../jobseekerDashboard/DashboardSidebar";
import MainFooter from "../layout/MainFooter";

const JobseekerLayout = ({ user }) => {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <DashboardHeader user={user} />

      <div className="flex min-h-0 flex-1">
        <DashboardSidebar />

        <main className="min-w-0 flex-1 pt-18.25">
          <Outlet />
        </main>
      </div>

      <MainFooter />
    </div>
  );
};

export default JobseekerLayout;

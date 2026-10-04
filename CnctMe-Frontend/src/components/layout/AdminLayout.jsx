import { Outlet } from "react-router-dom";

import DashboardHeader from "../adminDashboard/AdminHeader";
import DashboardSidebar from "../adminDashboard/AdminSidebar";
import MainFooter from "../layout/MainFooter";

const RecruiterLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <DashboardHeader />

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

export default RecruiterLayout;

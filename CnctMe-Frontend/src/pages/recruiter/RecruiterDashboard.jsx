import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getDashboard,
  selectDashboardLoading,
  selectDashboardError,
  getRecentJobs,
  getRecentApplicants,
  getUpcomingInterviews,
  getRecruiterAnalytics,
} from "../../features/recruiter/recruiterSlice";

import { selectUser } from "../../features/auth/authSlice";

import StatCard from "../../components/recruiterDashboard/StatCard";
import RecentJobs from "../../components/recruiterDashboard/RecentJobs";
import RecentApplicants from "../../components/recruiterDashboard/RecentApplicants";
import UpcomingInterviews from "../../components/recruiterDashboard/UpcomingInterviews";
import AnalyticsSection from "../../components/recruiterDashboard/AnalyticsSection";

const RecruiterDashboard = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName ||
        user?.name ||
        user?.fullName ||
        user?.email?.split("@")[0] ||
        "User";

  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getRecentJobs());
    dispatch(getRecentApplicants());
    dispatch(getUpcomingInterviews());
    dispatch(getRecruiterAnalytics());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="w-full px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
        {/* Dashboard Heading */}
        <div className="mb-6 sm:mb-7">
          <p className="mb-1 text-xs font-medium text-[#0859A8] sm:text-sm">
            Recruiter Dashboard
          </p>

          <h1 className="warp-break-words text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
            Welcome back, {userName}
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8998A6] sm:text-sm">
            Here's what's happening with your recruitment today.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mb-5 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-xs text-[#52606D] sm:mb-6 sm:px-5 sm:py-4 sm:text-sm">
            Loading dashboard...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-600 sm:mb-6 sm:px-5 sm:py-4 sm:text-sm">
            {error.general || "Unable to load dashboard."}
          </div>
        )}

        {/* Stats */}
        <section className="mb-5 sm:mb-6">
          <StatCard />
        </section>

        {/* Analytics */}
        <AnalyticsSection />

        {/* Recent Jobs + Recent Applicants */}
        <section className="mt-6 grid grid-cols-1 gap-5 sm:mt-7 sm:gap-6 xl:grid-cols-2">
          <RecentJobs />
          <RecentApplicants />
        </section>

        {/* Upcoming Interviews */}
        <section className="mt-5 sm:mt-6">
          <UpcomingInterviews />
        </section>
      </div>
    </div>
  );
};

export default RecruiterDashboard;

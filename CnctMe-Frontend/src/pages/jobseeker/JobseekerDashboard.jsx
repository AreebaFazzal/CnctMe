import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectUser } from "../../features/auth/authSlice";

import {
  getJobseekerDashboard,
  getRecentApplications,
  getUpcomingInterviews,
} from "../../features/jobseeker/jobseekerSlice";

import QuickStats from "../../components/jobseekerDashboard/QuickStats";
import RecentApplications from "../../components/jobseekerDashboard/RecentApplications";
import UpcomingInterviews from "../../components/jobseekerDashboard/UpcomingInterviews";
import AnalyticsSection from "../../components/jobseekerDashboard/AnalyticsSection";

const JobseekerDashboard = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName ||
        user?.name ||
        user?.fullName ||
        user?.email?.split("@")[0] ||
        "User";

  useEffect(() => {
    dispatch(getJobseekerDashboard());
    dispatch(getRecentApplications());
    dispatch(getUpcomingInterviews());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="w-full px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
        <div className="mb-6 sm:mb-7">
          <p className="mb-1 text-xs font-medium text-[#0859A8] sm:text-sm">
            Jobseeker Dashboard
          </p>

          <h1 className="wrap-break-words text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
            Welcome back, {userName}
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8998A6] sm:text-sm">
            Keep track of your job applications and discover new opportunities.
          </p>
        </div>

        <section className="mb-5 sm:mb-6">
          <QuickStats />
        </section>

        <section className="mb-5 sm:mb-6">
          <AnalyticsSection />
        </section>

        <section className="mb-5 sm:mb-6">
          <RecentApplications />
        </section>

        <section className="mb-5 sm:mb-6">
          <UpcomingInterviews />
        </section>
      </div>
    </div>
  );
};

export default JobseekerDashboard;

import { FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectRecentApplications,
  selectRecentApplicationsLoading,
} from "../../features/jobseeker/jobseekerSlice";

import Card from "../ui/Card";
import getLogoSrc from "../../utils/logo";

const RecentApplications = () => {
  const applications = useSelector(selectRecentApplications);
  const loading = useSelector(selectRecentApplicationsLoading);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[#25364A] sm:text-base">
            Recent Applications
          </h2>

          <p className="mt-1 text-xs text-[#8998A6] sm:text-sm">
            Track the latest jobs you have applied for.
          </p>
        </div>

        <Link
          to="/jobseeker/applications"
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#0859A8] transition-colors hover:text-[#064A8D] sm:text-sm"
        >
          View All
          <ArrowRight size={15} strokeWidth={2} />
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-[#E6EBEF] p-3"
            >
              <div className="h-13 w-13 shrink-0 animate-pulse rounded-full bg-[#E6EBEF]" />

              <div className="min-w-0 flex-1">
                <div className="h-3 w-2/5 animate-pulse rounded bg-[#E6EBEF]" />

                <div className="mt-2 h-2.5 w-1/4 animate-pulse rounded bg-[#F0F3F5]" />
              </div>

              <div className="h-6 w-20 animate-pulse rounded-full bg-[#F0F3F5]" />
            </div>
          ))}
        </div>
      ) : applications.length > 0 ? (
        /* Applications */
        <div className="mt-5 divide-y divide-[#E6EBEF]">
          {applications.map((application) => {
            const companyName =
              application.job?.company?.companyName || "Company";

            const companyLogo = getLogoSrc(application.job?.company?.logo);

            return (
              <div
                key={application._id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {/* COMPANY LOGO */}
                  <div className="flex h-15 w-15 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DCE5EC] bg-[#EEF6FB] shadow-sm">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={`${companyName} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-base font-bold text-[#0859A8]">
                        {companyName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* JOB INFORMATION */}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#25364A]">
                      {application.job?.title || "Job Title"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-[#8998A6]">
                      {companyName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-xs text-[#8998A6]">
                    {formatDate(application.createdAt)}
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      application.status === "Selected"
                        ? "bg-[#EEF8F1] text-[#2E8B57]"
                        : application.status === "Rejected"
                          ? "bg-[#FDEEEE] text-[#C94A4A]"
                          : application.status === "Shortlisted"
                            ? "bg-[#FFF9E8] text-[#B78300]"
                            : application.status === "Interview"
                              ? "bg-[#EEF6FB] text-[#4F7CAC]"
                              : "bg-[#EEF6FB] text-[#0859A8]"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex min-h-45 flex-col items-center justify-center px-4 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF6FB]">
            <FileText size={21} strokeWidth={1.8} className="text-[#0859A8]" />
          </div>

          <h3 className="text-sm font-semibold text-[#25364A]">
            No applications yet
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-relaxed text-[#8998A6]">
            Once you apply for jobs, your recent applications will appear here.
          </p>

          <Link
            to="/jobs"
            className="mt-4 rounded-lg bg-[#0859A8] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#064A8D]"
          >
            Find Jobs
          </Link>
        </div>
      )}
    </Card>
  );
};

export default RecentApplications;

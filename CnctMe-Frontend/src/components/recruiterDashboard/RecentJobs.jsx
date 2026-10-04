import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  MapPin,
  Clock3,
  Users,
  ArrowRight,
} from "lucide-react";
import { useSelector } from "react-redux";

import { selectRecentJobs } from "../../features/recruiter/recruiterSlice";
import Card from "../ui/Card";

const RecentJobs = () => {
  const recentJobs = useSelector(selectRecentJobs);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatText = (value) => {
    if (!value) return "";

    return value
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[#25364A]">
            Recent Jobs
          </h2>

          <p className="mt-1 text-xs text-[#8998A6]">
            Your latest job postings
          </p>
        </div>

        <Link
          to="/recruiter/jobs"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#0859A8] transition hover:text-[#06477F] max-sm:text-xs"
        >
          View All
          <ArrowRight size={15} className="max-sm:h-3.5 max-sm:w-3.5" />
        </Link>
      </div>

      {recentJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DCE3E8] bg-[#F8FAFC] px-6 py-10 text-center max-sm:px-4 max-sm:py-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E6EFF8]">
            <BriefcaseBusiness size={22} className="text-[#0859A8]" />
          </div>

          <h3 className="text-sm font-semibold text-[#25364A]">
            No jobs posted yet
          </h3>

          <p className="mt-1 max-w-xs text-xs text-[#8998A6]">
            Create your first job posting to start attracting candidates.
          </p>

          <Link
            to="/recruiter/jobs/create"
            className="mt-4 rounded-lg bg-[#0859A8] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#06477F]"
          >
            Create a Job
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[#EEF1F4]">
          {recentJobs.map((job) => (
            <div key={job._id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-4 max-sm:flex-col max-sm:gap-3">
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="line-clamp-1 text-sm font-semibold text-[#25364A] transition hover:text-[#0859A8] max-sm:text-xs"
                  >
                    {job.title}
                  </Link>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#8998A6] max-sm:text-[11px]">
                    <MapPin
                      size={13}
                      className="shrink-0 max-sm:h-3 max-sm:w-3"
                    />

                    <span className="truncate">
                      {job.location || "Location not specified"}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {job.jobType && (
                      <span className="rounded-md bg-[#EEF6FB] px-2 py-1 text-[11px] font-medium text-[#0859A8] max-sm:px-1.5 max-sm:py-0.5 max-sm:text-[10px]">
                        {formatText(job.jobType)}
                      </span>
                    )}

                    {job.workMode && (
                      <span className="rounded-md bg-[#F3F2F0] px-2 py-1 text-[11px] font-medium text-[#52606D] max-sm:px-1.5 max-sm:py-0.5 max-sm:text-[10px]">
                        {formatText(job.workMode)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2 max-sm:w-full max-sm:flex-row max-sm:items-center max-sm:justify-between">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium max-sm:px-2 max-sm:py-0.5 max-sm:text-[10px] ${
                      job.status === "active"
                        ? "bg-[#EEF8F1] text-[#2E8B57]"
                        : "bg-[#F3F2F0] text-[#68798A]"
                    }`}
                  >
                    {job.status === "active" ? "Active" : "Closed"}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-[#68798A] max-sm:text-[10px]">
                    <Users
                      size={13}
                      className="shrink-0 max-sm:h-3 max-sm:w-3"
                    />

                    <span className="whitespace-nowrap">
                      {job.applicantCount || 0}{" "}
                      {job.applicantCount === 1 ? "Applicant" : "Applicants"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#8998A6] max-sm:mt-2.5 max-sm:text-[10px]">
                <Clock3 size={12} className="shrink-0 max-sm:h-3 max-sm:w-3" />

                <span>Posted {formatDate(job.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentJobs;

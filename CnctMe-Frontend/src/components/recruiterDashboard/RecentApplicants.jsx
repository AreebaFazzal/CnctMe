import { Link } from "react-router-dom";
import { User, BriefcaseBusiness, Clock3, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";

import { selectRecentApplicants } from "../../features/recruiter/recruiterSlice";

import Card from "../ui/Card";
import getLogoSrc from "../../utils/logo";

const RecentApplicants = () => {
  const recentApplicants = useSelector(selectRecentApplicants);

  // Format Date
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get Applicant Name
  const getApplicantName = (user) => {
    if (!user) return "Unknown Applicant";

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return fullName || "Unknown Applicant";
  };

  // Get Initials
  const getInitials = (user) => {
    if (!user) return "U";

    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase() || "U";
  };

  // Status Styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied":
        return "bg-[#EEF6FB] text-[#0859A8]";

      case "Under Review":
        return "bg-[#FFF9E8] text-[#B78300]";

      case "Shortlisted":
        return "bg-[#EEF8F1] text-[#2E8B57]";

      case "Interview":
        return "bg-[#E6EFF8] text-[#0859A8]";

      case "Selected":
        return "bg-[#EAF7EF] text-[#267A4A]";

      case "Rejected":
        return "bg-[#FDEEEE] text-[#C94A4A]";

      default:
        return "bg-[#F3F2F0] text-[#68798A]";
    }
  };

  return (
    <Card>
      {/* =========================
          Header
      ========================= */}

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[#25364A]">
            Recent Applicants
          </h2>

          <p className="mt-1 text-xs text-[#8998A6]">
            Latest candidates who applied
          </p>
        </div>

        <Link
          to="/recruiter/applications"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#0859A8] transition hover:text-[#06477F] max-sm:text-xs"
        >
          View All
          <ArrowRight size={15} className="max-sm:h-3.5 max-sm:w-3.5" />
        </Link>
      </div>

      {/* =========================
          Empty State
      ========================= */}

      {recentApplicants.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DCE3E8] bg-[#F8FAFC] px-6 py-10 text-center max-sm:px-4 max-sm:py-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E6EFF8]">
            <User size={22} className="text-[#0859A8]" />
          </div>

          <h3 className="text-sm font-semibold text-[#25364A]">
            No applicants yet
          </h3>

          <p className="mt-1 max-w-xs text-xs text-[#8998A6]">
            Applicants will appear here when candidates apply to your jobs.
          </p>
        </div>
      ) : (
        /* =========================
           Applicants List
        ========================= */

        <div className="divide-y divide-[#EEF1F4]">
          {recentApplicants.map((application) => {
            const applicant = application.user;
            const job = application.job;

            const applicantImageSrc = applicant?.profilePicture
              ? getLogoSrc(applicant.profilePicture)
              : null;

            return (
              <div key={application._id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4 max-sm:gap-2.5">
                  {/* =========================
                      Applicant Information
                  ========================= */}

                  <div className="flex min-w-0 flex-1 items-center gap-3 max-sm:gap-2.5">
                    {/* Profile / Initials */}

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DCE3E8] bg-[#E6EFF8] text-base font-semibold text-[#0859A8] max-sm:h-12 max-sm:w-12 max-sm:text-sm">
                      {applicantImageSrc ? (
                        <img
                          src={applicantImageSrc}
                          alt={getApplicantName(applicant)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(applicant)
                      )}
                    </div>

                    {/* Name + Job */}

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-[#25364A] max-sm:text-xs">
                        {getApplicantName(applicant)}
                      </h3>

                      <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-[#8998A6] max-sm:text-[11px]">
                        <BriefcaseBusiness
                          size={12}
                          className="shrink-0 max-sm:h-3 max-sm:w-3"
                        />

                        <span className="truncate">
                          {job?.title || "Job title unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* =========================
                      Status
                  ========================= */}

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium max-sm:max-w-22.5 max-sm:truncate max-sm:px-2 max-sm:py-0.5 max-sm:text-[10px] ${getStatusStyle(
                      application.status,
                    )}`}
                  >
                    {application.status || "Applied"}
                  </span>
                </div>

                {/* =========================
                    Application Date
                ========================= */}

                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#8998A6] max-sm:mt-2.5 max-sm:text-[10px]">
                  <Clock3
                    size={12}
                    className="shrink-0 max-sm:h-3 max-sm:w-3"
                  />

                  <span>Applied {formatDate(application.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default RecentApplicants;

import { Link } from "react-router-dom";
import { CalendarDays, Clock3, Video, User, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";

import { selectUpcomingInterviews } from "../../features/recruiter/recruiterSlice";

import Card from "../ui/Card";

import getLogoSrc from "../../utils/logo";

const UpcomingInterviews = () => {
  const upcomingInterviews = useSelector(selectUpcomingInterviews);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCandidateName = (candidate) => {
    if (!candidate) return "Unknown Candidate";

    const fullName = `${candidate.firstName || ""} ${
      candidate.lastName || ""
    }`.trim();

    return fullName || "Unknown Candidate";
  };

  const getInitials = (candidate) => {
    if (!candidate) return "U";

    const first = candidate.firstName?.charAt(0) || "";
    const last = candidate.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase() || "U";
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-[#EEF8F1] text-[#2E8B57]";

      case "Completed":
        return "bg-[#E6EFF8] text-[#0859A8]";

      case "Cancelled":
        return "bg-[#FDEEEE] text-[#C94A4A]";

      default:
        return "bg-[#F3F2F0] text-[#68798A]";
    }
  };

  return (
    <Card>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-[#25364A]">
            Upcoming Interviews
          </h2>

          <p className="mt-1 text-xs text-[#8998A6]">
            Your next scheduled candidate interviews
          </p>
        </div>

        <Link
          to="/recruiter/interviews"
          className="flex w-fit shrink-0 items-center gap-1 text-sm font-medium text-[#0859A8] transition hover:text-[#06477F]"
        >
          View All
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Empty State */}
      {upcomingInterviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#DCE3E8] bg-[#F8FAFC] px-4 py-8 text-center sm:px-6 sm:py-10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E6EFF8]">
            <CalendarDays size={22} className="text-[#0859A8]" />
          </div>

          <h3 className="text-sm font-semibold text-[#25364A]">
            No upcoming interviews
          </h3>

          <p className="mt-1 max-w-xs text-xs text-[#8998A6]">
            Scheduled interviews with candidates will appear here.
          </p>
        </div>
      ) : (
        /* Interviews List */
        <div className="divide-y divide-[#EEF1F4]">
          {upcomingInterviews.map((interview) => {
            const candidate = interview.candidate;
            const job = interview.application?.job;

            const candidateImageSrc = candidate?.profilePicture
              ? getLogoSrc(candidate.profilePicture)
              : null;

            return (
              <div key={interview._id} className="py-4 first:pt-0 last:pb-0">
                {/* Candidate + Status */}
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    {/* Candidate Avatar */}
                    {/* Candidate Avatar */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DCE3E8] bg-[#E6EFF8] text-sm font-semibold text-[#0859A8] sm:h-14 sm:w-14 sm:text-base">
                      {candidateImageSrc ? (
                        <img
                          src={candidateImageSrc}
                          alt={getCandidateName(candidate)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(candidate)
                      )}
                    </div>

                    {/* Candidate Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-[#25364A]">
                        {getCandidateName(candidate)}
                      </h3>

                      <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-[#8998A6]">
                        <User size={12} className="shrink-0" />

                        <span className="truncate">
                          {job?.title || "Job title unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <span
                    className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${getStatusStyle(
                      interview.status,
                    )}`}
                  >
                    {interview.status || "Scheduled"}
                  </span>
                </div>

                {/* Date + Time */}
                <div className="mt-3 flex flex-col items-start gap-2 text-xs text-[#68798A] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-2">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={13} className="shrink-0" />

                    <span>{formatDate(interview.date)}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock3 size={13} className="shrink-0" />

                    <span>{interview.time || "Time not specified"}</span>
                  </div>
                </div>

                {/* Meeting Link */}
                {interview.meetingLink && (
                  <div className="mt-3">
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0859A8] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#06477F] sm:w-auto"
                    >
                      <Video size={13} />
                      Join Interview
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default UpcomingInterviews;

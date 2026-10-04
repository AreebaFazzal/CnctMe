import {
  CalendarDays,
  Clock3,
  Video,
  ArrowRight,
  BriefcaseBusiness,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectUpcomingInterviews,
  selectUpcomingInterviewsLoading,
} from "../../features/jobseeker/jobseekerSlice";

import Card from "../ui/Card";
import getLogoSrc from "../../utils/logo";

const UpcomingInterviews = () => {
  const interviews = useSelector(selectUpcomingInterviews);
  const loading = useSelector(selectUpcomingInterviewsLoading);

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
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[#25364A] sm:text-base">
            Upcoming Interviews
          </h2>

          <p className="mt-1 text-xs text-[#8998A6] sm:text-sm">
            Stay prepared for your upcoming interviews.
          </p>
        </div>

        <Link
          to="/jobseeker/interviews"
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#0859A8] transition-colors hover:text-[#064A8D] sm:text-sm"
        >
          View All
          <ArrowRight size={15} strokeWidth={2} />
        </Link>
      </div>

      {loading ? (
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex flex-col gap-3 rounded-xl border border-[#E6EBEF] p-3 sm:flex-row sm:items-center"
            >
              <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-[#E6EBEF]" />

              <div className="min-w-0 flex-1">
                <div className="h-3 w-2/5 animate-pulse rounded bg-[#E6EBEF]" />

                <div className="mt-2 h-2.5 w-1/4 animate-pulse rounded bg-[#F0F3F5]" />

                <div className="mt-2 h-2.5 w-2/5 animate-pulse rounded bg-[#F0F3F5]" />
              </div>

              <div className="h-7 w-20 animate-pulse rounded-full bg-[#F0F3F5]" />
            </div>
          ))}
        </div>
      ) : interviews.length > 0 ? (
        <div className="mt-5 divide-y divide-[#E6EBEF]">
          {interviews.map((interview) => {
            const job = interview.application?.job;

            const company = job?.company?.companyName || "Company";

            const companyLogoSrc = job?.company?.logo
              ? getLogoSrc(job.company.logo)
              : null;

            return (
              <div
                key={interview._id}
                className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  {/* Company Logo */}
                  <div className="flex h-15 w-15 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DCE3E8] bg-[#EEF6FB]">
                    {companyLogoSrc ? (
                      <img
                        src={companyLogoSrc}
                        alt={`${company} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-[#0859A8]">
                        {company.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#25364A]">
                      {job?.title || "Interview"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-[#8998A6]">
                      {company}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#52606D]">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={13} strokeWidth={1.8} />
                        {formatDate(interview.date)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock3 size={13} strokeWidth={1.8} />
                        {interview.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="rounded-full bg-[#EEF8F1] px-2.5 py-1 text-[11px] font-medium text-[#2E8B57]">
                    Scheduled
                  </span>

                  {interview.meetingLink ? (
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-[#DCE3E8] px-3 py-1.5 text-xs font-medium text-[#52606D] transition-colors hover:border-[#BFCBD4] hover:bg-[#F8FAFC]"
                    >
                      <Video size={14} strokeWidth={1.8} />
                      Join
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-[#8998A6]">
                      <BriefcaseBusiness size={14} strokeWidth={1.8} />
                      Interview
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-45 flex-col items-center justify-center px-4 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF6FB]">
            <CalendarDays
              size={21}
              strokeWidth={1.8}
              className="text-[#0859A8]"
            />
          </div>

          <h3 className="text-sm font-semibold text-[#25364A]">
            No upcoming interviews
          </h3>

          <p className="mt-1 max-w-sm text-xs leading-relaxed text-[#8998A6]">
            Interviews scheduled by recruiters will appear here.
          </p>

          <Link
            to="/jobseeker/applications"
            className="mt-4 rounded-lg bg-[#0859A8] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#064A8D]"
          >
            View Applications
          </Link>
        </div>
      )}
    </Card>
  );
};

export default UpcomingInterviews;

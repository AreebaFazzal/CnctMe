import { CalendarDays, Clock3, Video } from "lucide-react";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getUpcomingInterviews,
  selectUpcomingInterviews,
  selectUpcomingInterviewsLoading,
} from "../../features/jobseeker/jobseekerSlice";

import Card from "../../components/ui/Card";
import getLogoSrc from "../../utils/logo";

const JobseekerInterviews = () => {
  const dispatch = useDispatch();

  const interviews = useSelector(selectUpcomingInterviews);
  const loading = useSelector(selectUpcomingInterviewsLoading);

  useEffect(() => {
    dispatch(getUpcomingInterviews());
  }, [dispatch]);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="w-full px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
        <div className="mb-6 sm:mb-7">
          <p className="mb-1 text-xs font-medium text-[#0859A8] sm:text-sm">
            Jobseeker
          </p>

          <h1 className="text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
            Interviews
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8998A6] sm:text-sm">
            View your upcoming interviews and meeting details.
          </p>
        </div>

        <Card>
          <div className="flex items-center gap-2">
            <CalendarDays
              size={19}
              strokeWidth={2}
              className="text-[#0859A8]"
            />

            <div>
              <h2 className="text-sm font-bold text-[#25364A] sm:text-base">
                Upcoming Interviews
              </h2>

              <p className="mt-1 text-xs text-[#8998A6] sm:text-sm">
                Interviews scheduled by recruiters.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-[#E6EBEF] p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-[#E6EBEF]" />

                    <div className="min-w-0 flex-1">
                      <div className="h-3 w-2/5 animate-pulse rounded bg-[#E6EBEF]" />

                      <div className="mt-2 h-2.5 w-1/4 animate-pulse rounded bg-[#F0F3F5]" />

                      <div className="mt-3 h-2.5 w-1/2 animate-pulse rounded bg-[#F0F3F5]" />
                    </div>

                    <div className="h-8 w-24 animate-pulse rounded-lg bg-[#F0F3F5]" />
                  </div>
                </div>
              ))}
            </div>
          ) : interviews.length > 0 ? (
            <div className="mt-6 space-y-4">
              {interviews.map((interview) => {
                const job = interview.application?.job;

                const company = job?.company?.companyName || "Company";

                const companyLogoSrc = job?.company?.logo
                  ? getLogoSrc(job.company.logo)
                  : null;

                return (
                  <div
                    key={interview._id}
                    className="rounded-xl border border-[#DCE3E8] bg-white p-4 transition-colors hover:border-[#C8D5DF] sm:p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        {/* Company Logo */}
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#DCE3E8] bg-[#EEF6FB]">
                          {companyLogoSrc ? (
                            <img
                              src={companyLogoSrc}
                              alt={`${company} logo`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-base font-semibold text-[#0859A8]">
                              {company.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-[#25364A] sm:text-base">
                            {job?.title || "Interview"}
                          </h3>

                          <p className="mt-0.5 truncate text-xs text-[#8998A6] sm:text-sm">
                            {company}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#52606D]">
                            <span className="flex items-center gap-1.5">
                              <CalendarDays
                                size={14}
                                strokeWidth={1.8}
                                className="text-[#8998A6]"
                              />
                              {formatDate(interview.date)}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <Clock3
                                size={14}
                                strokeWidth={1.8}
                                className="text-[#8998A6]"
                              />
                              {interview.time}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                        <span className="rounded-full bg-[#EEF8F1] px-3 py-1.5 text-[11px] font-medium text-[#2E8B57]">
                          {interview.status}
                        </span>

                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 rounded-lg bg-[#0859A8] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#064A8D]"
                        >
                          <Video size={14} strokeWidth={1.8} />
                          Join Interview
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-75 flex-col items-center justify-center px-4 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF6FB]">
                <CalendarDays
                  size={23}
                  strokeWidth={1.8}
                  className="text-[#0859A8]"
                />
              </div>

              <h3 className="text-sm font-semibold text-[#25364A] sm:text-base">
                No upcoming interviews
              </h3>

              <p className="mt-1 max-w-md text-xs leading-relaxed text-[#8998A6] sm:text-sm">
                When a recruiter schedules an interview for one of your
                applications, it will appear here.
              </p>

              <Link
                to="/jobseeker/applications"
                className="mt-5 rounded-lg bg-[#0859A8] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-[#064A8D]"
              >
                View Applications
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default JobseekerInterviews;

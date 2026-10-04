import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  RefreshCw,
} from "lucide-react";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";
import getLogoSrc from "../../utils/logo";

const MyApplications = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);

  const limit = 10;

  // FETCH APPLICATIONS
  useEffect(() => {
    let cancelled = false;

    const fetchApplications = async () => {
      try {
        if (!cancelled) {
          setLoading(true);
          setError(null);
        }

        const response = await api.get("/applications/my", {
          params: {
            page: currentPage,
            limit,
          },
        });

        if (cancelled) return;

        setApplications(response.data.applications || []);

        setCurrentPage(response.data.pagination?.currentPage || currentPage);

        setTotalPages(response.data.pagination?.totalPages || 1);

        setTotalApplications(response.data.pagination?.totalApplications || 0);
      } catch (error) {
        if (cancelled) return;

        console.error("Fetch Applications Error:", error);

        setError(getApiError(error));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchApplications();

    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  // RETRY
  const handleRetry = () => {
    setError(null);
    setLoading(true);

    const retry = async () => {
      try {
        const response = await api.get("/applications/my", {
          params: {
            page: currentPage,
            limit,
          },
        });

        setApplications(response.data.applications || []);

        setTotalPages(response.data.pagination?.totalPages || 1);

        setTotalApplications(response.data.pagination?.totalApplications || 0);
      } catch (error) {
        console.error("Retry Applications Error:", error);

        setError(getApiError(error));
      } finally {
        setLoading(false);
      }
    };

    retry();
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Applied":
        return "bg-[#EEF6FB] text-[#0859A8] border-[#D8EAF5]";

      case "Under Review":
        return "bg-[#FFF9E8] text-[#A06D00] border-[#F0DEAA]";

      case "Shortlisted":
        return "bg-[#EEF8F1] text-[#267A4A] border-[#CDE8D6]";

      case "Interview":
        return "bg-[#F0F5FA] text-[#4F7CAC] border-[#D5E1EC]";

      case "Selected":
        return "bg-[#EEF8F1] text-[#267A4A] border-[#CDE8D6]";

      case "Rejected":
        return "bg-[#FDF2F2] text-[#C94A4A] border-[#F0D0D0]";

      default:
        return "bg-[#F3F2F0] text-[#697586] border-[#DCE3E8]";
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="w-full px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
          <div className="mb-6">
            <div className="h-7 w-48 animate-pulse rounded bg-[#E6EDF2]" />

            <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-[#E6EDF2]" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[#DCE3E8] bg-white p-5 sm:p-6"
              >
                <div className="flex gap-4">
                  <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-[#E6EDF2]" />

                  <div className="min-w-0 flex-1">
                    <div className="h-5 w-48 max-w-full animate-pulse rounded bg-[#E6EDF2]" />

                    <div className="mt-2 h-4 w-32 animate-pulse rounded bg-[#E6EDF2]" />

                    <div className="mt-4 h-3 w-72 max-w-full animate-pulse rounded bg-[#E6EDF2]" />
                  </div>
                </div>

                <div className="mt-5 border-t border-[#E8EDF1] pt-4">
                  <div className="h-4 w-36 animate-pulse rounded bg-[#E6EDF2]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="w-full px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
          <div className="mb-6">
            <p className="mb-1 text-xs font-medium text-[#0859A8] sm:text-sm">
              Jobseeker
            </p>

            <h1 className="text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
              My Applications
            </h1>

            <p className="mt-1 text-xs leading-relaxed text-[#8998A6] sm:text-sm">
              Track the jobs you have applied for.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DCE3E8] bg-white p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FDF2F2]">
              <RefreshCw size={24} className="text-[#C94A4A]" />
            </div>

            <h2 className="mt-4 text-base font-bold text-[#25364A]">
              Unable to load applications
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#697586]">
              {error.general ||
                "Something went wrong while loading your applications."}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064987]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY STATE
  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="w-full px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
          <div className="mb-6">
            <p className="mb-1 text-xs font-medium text-[#0859A8] sm:text-sm">
              Jobseeker
            </p>

            <h1 className="text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
              My Applications
            </h1>

            <p className="mt-1 text-xs leading-relaxed text-[#8998A6] sm:text-sm">
              Track the jobs you have applied for.
            </p>
          </div>

          <div className="rounded-2xl border border-[#DCE3E8] bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6EFF8]">
              <BriefcaseBusiness size={26} className="text-[#0859A8]" />
            </div>

            <h2 className="mt-4 text-base font-bold text-[#25364A]">
              No applications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#697586]">
              You haven't applied to any jobs yet. Start exploring jobs and
              submit your first application.
            </p>

            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="mt-5 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064987]"
            >
              Find Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="w-full px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
        {/* PAGE HEADER */}

        <div className="mb-6 sm:mb-7">
          <p className="mb-1 text-xs font-medium text-[#0859A8] sm:text-sm">
            Jobseeker
          </p>

          <h1 className="text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
            My Applications
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8998A6] sm:text-sm">
            Track the status of your job applications and stay updated on your
            progress.
          </p>
        </div>

        {/* SUMMARY */}

        <div className="mb-5 rounded-2xl border border-[#DCE3E8] bg-white px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#25364A]">
                Your Applications
              </p>

              <p className="mt-0.5 text-xs text-[#8998A6]">
                {totalApplications}{" "}
                {totalApplications === 1 ? "application" : "applications"}{" "}
                submitted
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="w-fit rounded-lg border border-[#D8EAF5] bg-[#EEF6FB] px-4 py-2 text-sm font-semibold text-[#0859A8] transition hover:bg-[#E1EFF9]"
            >
              Find More Jobs
            </button>
          </div>
        </div>

        {/* APPLICATIONS */}

        <div className="space-y-4">
          {applications.map((application) => {
            const job = application.job;

            if (!job) {
              return null;
            }

            const companyName = job.company?.companyName || "Company";

            const companyInitial = companyName.charAt(0).toUpperCase();

            const companyLogo = getLogoSrc(job.company?.logo);

            return (
              <article
                key={application._id}
                className="rounded-2xl border border-[#DCE3E8] bg-white p-5 transition-all duration-200 hover:border-[#0859A8]/30 hover:shadow-md sm:p-6"
              >
                {/* TOP SECTION */}

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 gap-4">
                    {/* COMPANY LOGO */}

                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[#D8EAF5] bg-[#EEF6FB]">
                      {companyLogo ? (
                        <img
                          src={companyLogo}
                          alt={`${companyName} logo`}
                          className="block h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full">
                          <span className="text-lg font-bold text-[#0859A8]">
                            {companyInitial}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* JOB DETAILS */}

                    <div className="min-w-0">
                      <h2 className="wrap-break-words text-lg font-bold text-[#25364A]">
                        {job.title}
                      </h2>

                      <p className="mt-1 text-sm font-medium text-[#0859A8]">
                        {companyName}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                        {job.location && (
                          <div className="flex items-center gap-1.5 text-xs text-[#697586]">
                            <MapPin
                              size={14}
                              className="shrink-0 text-[#8998A6]"
                            />
                            <span>{job.location}</span>
                          </div>
                        )}

                        {job.jobType && (
                          <div className="flex items-center gap-1.5 text-xs capitalize text-[#697586]">
                            <BriefcaseBusiness
                              size={14}
                              className="shrink-0 text-[#8998A6]"
                            />
                            <span>{job.jobType}</span>
                          </div>
                        )}

                        {job.workMode && (
                          <div className="flex items-center gap-1.5 text-xs capitalize text-[#697586]">
                            <Clock3
                              size={14}
                              className="shrink-0 text-[#8998A6]"
                            />
                            <span>{job.workMode}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div className="shrink-0">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyles(
                        application.status,
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>
                </div>

                {/* BOTTOM SECTION */}

                <div className="mt-5 border-t border-[#E8EDF1] pt-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8998A6]">
                          Applied
                        </p>

                        <div className="mt-1 flex items-center gap-1.5">
                          <CalendarDays size={14} className="text-[#8998A6]" />

                          <p className="text-sm font-medium text-[#52606D]">
                            {formatDate(application.createdAt)}
                          </p>
                        </div>
                      </div>

                      {(job.salaryMin || job.salaryMax) && (
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8998A6]">
                            Salary
                          </p>

                          <p className="mt-1 text-sm font-medium text-[#52606D]">
                            PKR {job.salaryMin?.toLocaleString() || "N/A"} - PKR{" "}
                            {job.salaryMax?.toLocaleString() || "N/A"}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="w-full rounded-lg border border-[#D8EAF5] bg-white px-4 py-2.5 text-sm font-semibold text-[#0859A8] transition hover:bg-[#EEF6FB] sm:w-auto"
                    >
                      View Job
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* PAGINATION */}

        {totalPages > 1 && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#DCE3E8] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-[#697586]">
              Page{" "}
              <span className="font-semibold text-[#25364A]">
                {currentPage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#25364A]">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="flex items-center gap-1.5 rounded-lg border border-[#DCE3E8] bg-white px-3.5 py-2 text-sm font-medium text-[#52606D] transition hover:bg-[#F3F6F8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="flex items-center gap-1.5 rounded-lg border border-[#DCE3E8] bg-white px-3.5 py-2 text-sm font-medium text-[#52606D] transition hover:bg-[#F3F6F8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;

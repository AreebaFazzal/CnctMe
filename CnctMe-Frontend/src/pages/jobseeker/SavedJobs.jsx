import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Bookmark,
  ChevronRight,
  MapPin,
  RefreshCw,
  X,
} from "lucide-react";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";
import getLogoSrc from "../../utils/logo";

const SavedJobs = () => {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingJobId, setRemovingJobId] = useState(null);

  // FETCH SAVED JOBS
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get("/saved-jobs");

        setSavedJobs(response.data.savedJobs || []);
      } catch (error) {
        console.error("Fetch Saved Jobs Error:", error);
        setError(getApiError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  // REMOVE SAVED JOB
  const handleRemoveSavedJob = async (jobId) => {
    if (removingJobId) return;

    try {
      setRemovingJobId(jobId);

      await api.delete(`/jobs/${jobId}/save`);

      setSavedJobs((previousJobs) =>
        previousJobs.filter((savedJob) => savedJob.job?._id !== jobId),
      );
    } catch (error) {
      console.error("Remove Saved Job Error:", error);

      const errorObject = getApiError(error);

      alert(
        errorObject.general || "Unable to remove saved job. Please try again.",
      );
    } finally {
      setRemovingJobId(null);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC]">
        <div className="w-full px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
          {/* HEADER SKELETON */}

          <div className="mb-6">
            <div className="h-3.5 w-20 animate-pulse rounded bg-[#E6EDF2]" />

            <div className="mt-2 h-7 w-36 animate-pulse rounded-lg bg-[#E6EDF2]" />

            <div className="mt-2 h-4 w-56 max-w-full animate-pulse rounded bg-[#EEF2F5]" />
          </div>

          {/* CARDS SKELETON */}

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <article
                key={item}
                className="rounded-2xl border border-[#E2E8ED] bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-[#E6EDF2]" />

                    <div className="min-w-0 flex-1">
                      <div className="h-5 w-52 max-w-full animate-pulse rounded bg-[#E6EDF2]" />

                      <div className="mt-2 h-4 w-32 animate-pulse rounded bg-[#EEF2F5]" />

                      <div className="mt-4 flex gap-2">
                        <div className="h-3 w-20 animate-pulse rounded bg-[#EEF2F5]" />
                        <div className="h-3 w-16 animate-pulse rounded bg-[#EEF2F5]" />
                        <div className="h-3 w-20 animate-pulse rounded bg-[#EEF2F5]" />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="h-10 w-24 animate-pulse rounded-lg bg-[#EEF2F5]" />
                    <div className="h-10 w-10 animate-pulse rounded-lg bg-[#EEF2F5]" />
                  </div>
                </div>

                <div className="mt-5 border-t border-[#E8EDF1] pt-4">
                  <div className="h-3 w-28 animate-pulse rounded bg-[#EEF2F5]" />
                  <div className="mt-2 h-4 w-40 animate-pulse rounded bg-[#E6EDF2]" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC]">
        <div className="w-full px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
          <div className="mb-6">
            <p className="mb-1 text-xs font-medium text-[#0859A8] sm:text-sm">
              Jobseeker
            </p>

            <h1 className="text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
              Saved Jobs
            </h1>

            <p className="mt-1 text-sm text-[#8998A6]">
              Jobs you saved for later.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E1E7EC] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FDF2F2]">
              <RefreshCw size={23} className="text-[#C94A4A]" />
            </div>

            <h2 className="mt-4 text-base font-bold text-[#25364A]">
              Unable to load saved jobs
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#697586]">
              {error.general || "Something went wrong. Please try again."}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064987]"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY STATE
  if (savedJobs.length === 0) {
    return (
      <div className="min-h-screen w-full bg-[#F8FAFC]">
        <div className="w-full px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
          <div className="mb-6">
            <p className="mb-1 text-xs font-medium text-[#0859A8] sm:text-sm">
              Jobseeker
            </p>

            <h1 className="text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
              Saved Jobs
            </h1>

            <p className="mt-1 text-sm text-[#8998A6]">
              Jobs you saved for later.
            </p>
          </div>

          <div className="rounded-2xl border border-[#E1E7EC] bg-white shadow-sm">
            <div className="flex flex-col items-center px-6 py-16 text-center sm:py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF6FB]">
                <Bookmark
                  size={28}
                  strokeWidth={1.7}
                  className="text-[#0859A8]"
                />
              </div>

              <h2 className="mt-5 text-base font-bold text-[#25364A]">
                No saved jobs yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#697586]">
                Save jobs that interest you and come back to them whenever you
                are ready to apply.
              </p>

              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064987]"
              >
                Browse Jobs
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SAVED JOBS
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC]">
      <div className="w-full px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
        {/* PAGE HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-medium text-[#0859A8] sm:text-sm">
              Jobseeker
            </p>

            <h1 className="text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
              Saved Jobs
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8998A6] sm:text-sm">
              Keep track of opportunities you want to come back to.
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-[#DCE7EF] bg-white px-3.5 py-2 shadow-sm">
            <Bookmark size={14} className="text-[#0859A8]" />

            <span className="text-xs font-semibold text-[#52606D]">
              {savedJobs.length} {savedJobs.length === 1 ? "job" : "jobs"} saved
            </span>
          </div>
        </div>

        {/* JOB LIST */}

        <div className="space-y-4">
          {savedJobs.map((savedJob) => {
            const job = savedJob.job;

            if (!job) {
              return null;
            }

            const companyName = job.company?.companyName || "Company";

            const companyInitial = companyName.charAt(0).toUpperCase();

            const companyLogo = getLogoSrc(job.company?.logo);

            return (
              <article
                key={savedJob._id}
                className="group rounded-2xl border border-[#DCE3E8] bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#BFD6E7] hover:shadow-md sm:p-6"
              >
                {/* JOB HEADER */}

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 gap-4">
                    {/* LOGO */}

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D8EAF5] bg-[#EEF6FB] shadow-sm">
                      {companyLogo ? (
                        <img
                          src={companyLogo}
                          alt={`${companyName} logo`}
                          className="block h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-[#0859A8]">
                          {companyInitial}
                        </span>
                      )}
                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0">
                      <h2 className="wrap-break-words text-base font-bold text-[#25364A] transition-colors group-hover:text-[#0859A8] sm:text-lg">
                        {job.title}
                      </h2>

                      <p className="mt-1 text-sm font-medium text-[#0859A8]">
                        {companyName}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                        {job.location && (
                          <div className="flex items-center gap-1.5 text-xs text-[#697586]">
                            <MapPin
                              size={14}
                              strokeWidth={1.8}
                              className="shrink-0 text-[#8998A6]"
                            />

                            <span>{job.location}</span>
                          </div>
                        )}

                        {job.jobType && (
                          <div className="flex items-center gap-1.5 text-xs capitalize text-[#697586]">
                            <BriefcaseBusiness
                              size={14}
                              strokeWidth={1.8}
                              className="shrink-0 text-[#8998A6]"
                            />

                            <span>{job.jobType}</span>
                          </div>
                        )}

                        {job.workMode && (
                          <div className="flex items-center gap-1.5 text-xs capitalize text-[#697586]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#AAB7C2]" />

                            <span>{job.workMode}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                    <button
                      type="button"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0859A8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064987] sm:flex-none"
                    >
                      View Job
                      <ChevronRight size={15} />
                    </button>

                    <button
                      type="button"
                      disabled={removingJobId === job._id}
                      onClick={() => handleRemoveSavedJob(job._id)}
                      aria-label={`Remove ${job.title} from saved jobs`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#DCE3E8] bg-white text-[#697586] transition hover:border-[#E1B8B5] hover:bg-[#FDF7F6] hover:text-[#C94A4A] disabled:cursor-wait disabled:opacity-60"
                    >
                      {removingJobId === job._id ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#DCE3E8] border-t-[#C94A4A]" />
                      ) : (
                        <X size={17} strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                </div>

                {/* DIVIDER */}

                <div className="my-5 border-t border-[#E8EDF1]" />

                {/* FOOTER */}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* SALARY */}

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8998A6]">
                      Monthly Salary
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#25364A]">
                      {job.salaryMin || job.salaryMax
                        ? `PKR ${
                            job.salaryMin?.toLocaleString() || "N/A"
                          } - PKR ${job.salaryMax?.toLocaleString() || "N/A"}`
                        : "Salary not specified"}
                    </p>
                  </div>

                  {/* SKILLS */}

                  {job.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 lg:max-w-[60%] lg:justify-end">
                      {job.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={`${skill}-${index}`}
                          className="rounded-full border border-[#D8EAF5] bg-[#F4F9FC] px-3 py-1 text-[11px] font-medium text-[#35688F]"
                        >
                          {skill}
                        </span>
                      ))}

                      {job.skills.length > 4 && (
                        <span className="rounded-full border border-[#E0E6EB] bg-[#F8FAFB] px-3 py-1 text-[11px] font-medium text-[#8998A6]">
                          +{job.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;

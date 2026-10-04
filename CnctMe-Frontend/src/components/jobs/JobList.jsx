import { useSelector } from "react-redux";

import JobCard from "./JobCard";

import {
  selectJobs,
  selectJobLoading,
  selectJobError,
  selectTotalJobs,
} from "../../features/jobs/jobsSlice";

const JobList = () => {
  const jobs = useSelector(selectJobs);
  const loading = useSelector(selectJobLoading);
  const error = useSelector(selectJobError);
  const totalJobs = useSelector(selectTotalJobs);

  // LOADING
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}

        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 w-32 animate-pulse rounded-md bg-[#E9EDF0]" />

            <div className="mt-2 h-4 w-48 animate-pulse rounded-md bg-[#F1F4F6]" />
          </div>
        </div>

        {/* Loading Cards */}

        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-[#E4E8EB] bg-white p-6"
            >
              <div className="flex gap-4">
                {/* Logo Skeleton */}

                <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-[#E9EDF0]" />

                <div className="flex-1">
                  {/* Title */}

                  <div className="h-5 w-2/3 animate-pulse rounded-md bg-[#E9EDF0]" />

                  {/* Company */}

                  <div className="mt-3 h-4 w-1/3 animate-pulse rounded-md bg-[#F1F4F6]" />

                  {/* Tags */}

                  <div className="mt-5 flex gap-2">
                    <div className="h-6 w-20 animate-pulse rounded-full bg-[#F1F4F6]" />

                    <div className="h-6 w-24 animate-pulse rounded-full bg-[#F1F4F6]" />

                    <div className="h-6 w-20 animate-pulse rounded-full bg-[#F1F4F6]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ERROR
  if (error?.general) {
    return (
      <div className="rounded-xl border border-[#F3D6D2] bg-[#FDF7F6] p-8 sm:p-10">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          {/* Error Icon */}

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <svg
              className="h-6 w-6 text-[#B42318]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v4m0 4h.01M10.29 3.86l-7.82 13a2 2 0 001.71 3h15.64a2 2 0 001.71-3l-7.82-13a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>

          <h3 className="mt-4 text-base font-semibold text-[#16212B]">
            Something went wrong
          </h3>

          <p className="mt-1.5 text-sm leading-6 text-[#697586]">
            {error.general}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ==========================================
          RESULTS HEADER
      ========================================== */}

      <div className="mb-6 border-b border-[#E4E8EB] pb-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-semibold tracking-tight text-[#16212B]">
            Job results
          </h2>

          <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-[#EAF3F1] px-2 py-1 text-xs font-bold tabular-nums text-[#145C4B]">
            {totalJobs}
          </span>
        </div>

        <p className="mt-1.5 text-sm text-[#697586]">
          Showing available {totalJobs === 1 ? "opportunity" : "opportunities"}{" "}
          matching your search
        </p>
      </div>

      {/* ==========================================
          NO JOBS
      ========================================== */}

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#D7DEE3] bg-[#FBFCFC] px-6 py-14 sm:px-10">
          <div className="mx-auto flex max-w-md flex-col items-center text-center">
            {/* Empty State Icon */}

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF3F1]">
              <svg
                className="h-7 w-7 text-[#145C4B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
                />
              </svg>
            </div>

            <h3 className="mt-5 text-base font-semibold text-[#16212B]">
              No jobs found
            </h3>

            <p className="mt-1.5 max-w-sm text-sm leading-6 text-[#697586]">
              We couldn't find any jobs matching your current search or filters.
              Try adjusting your criteria.
            </p>
          </div>
        </div>
      ) : (
        /* ==========================================
           JOB LIST
        ========================================== */

        <div className="space-y-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
